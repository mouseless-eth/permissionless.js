"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signerToSimpleSmartAccount = void 0;
const viem_1 = require("viem");
const actions_1 = require("viem/actions");
const getAccountNonce_1 = require("../../actions/public/getAccountNonce.js");
const getSenderAddress_1 = require("../../actions/public/getSenderAddress.js");
const utils_1 = require("../../utils/index.js");
const getUserOperationHash_1 = require("../../utils/getUserOperationHash.js");
const isSmartAccountDeployed_1 = require("../../utils/isSmartAccountDeployed.js");
const toSmartAccount_1 = require("../toSmartAccount.js");
const types_1 = require("../types.js");
const getAccountInitCode = async (owner, index = BigInt(0)) => {
    if (!owner)
        throw new Error("Owner account not found");
    return (0, viem_1.encodeFunctionData)({
        abi: [
            {
                inputs: [
                    {
                        internalType: "address",
                        name: "owner",
                        type: "address"
                    },
                    {
                        internalType: "uint256",
                        name: "salt",
                        type: "uint256"
                    }
                ],
                name: "createAccount",
                outputs: [
                    {
                        internalType: "contract SimpleAccount",
                        name: "ret",
                        type: "address"
                    }
                ],
                stateMutability: "nonpayable",
                type: "function"
            }
        ],
        functionName: "createAccount",
        args: [owner, index]
    });
};
const getAccountAddress = async ({ client, factoryAddress, entryPoint: entryPointAddress, owner, index = BigInt(0) }) => {
    const entryPointVersion = (0, utils_1.getEntryPointVersion)(entryPointAddress);
    const factoryData = await getAccountInitCode(owner, index);
    if (entryPointVersion === "v0.6") {
        return (0, getSenderAddress_1.getSenderAddress)(client, {
            initCode: (0, viem_1.concatHex)([factoryAddress, factoryData]),
            entryPoint: entryPointAddress
        });
    }
    return (0, getSenderAddress_1.getSenderAddress)(client, {
        factory: factoryAddress,
        factoryData,
        entryPoint: entryPointAddress
    });
};
async function signerToSimpleSmartAccount(client, { signer, factoryAddress, entryPoint: entryPointAddress, index = BigInt(0), address }) {
    const viemSigner = {
        ...signer,
        signTransaction: (_, __) => {
            throw new types_1.SignTransactionNotSupportedBySmartAccount();
        }
    };
    const [accountAddress, chainId] = await Promise.all([
        address ??
            getAccountAddress({
                client,
                factoryAddress,
                entryPoint: entryPointAddress,
                owner: viemSigner.address,
                index
            }),
        client.chain?.id ?? (0, actions_1.getChainId)(client)
    ]);
    if (!accountAddress)
        throw new Error("Account address not found");
    let smartAccountDeployed = await (0, isSmartAccountDeployed_1.isSmartAccountDeployed)(client, accountAddress);
    return (0, toSmartAccount_1.toSmartAccount)({
        address: accountAddress,
        signMessage: async (_) => {
            throw new Error("Simple account isn't 1271 compliant");
        },
        signTransaction: (_, __) => {
            throw new types_1.SignTransactionNotSupportedBySmartAccount();
        },
        signTypedData: async (_) => {
            throw new Error("Simple account isn't 1271 compliant");
        },
        client: client,
        publicKey: accountAddress,
        entryPoint: entryPointAddress,
        source: "SimpleSmartAccount",
        async getNonce() {
            return (0, getAccountNonce_1.getAccountNonce)(client, {
                sender: accountAddress,
                entryPoint: entryPointAddress
            });
        },
        async signUserOperation(userOperation) {
            return (0, actions_1.signMessage)(client, {
                account: viemSigner,
                message: {
                    raw: (0, getUserOperationHash_1.getUserOperationHash)({
                        userOperation,
                        entryPoint: entryPointAddress,
                        chainId: chainId
                    })
                }
            });
        },
        async getInitCode() {
            if (smartAccountDeployed)
                return "0x";
            smartAccountDeployed = await (0, isSmartAccountDeployed_1.isSmartAccountDeployed)(client, accountAddress);
            if (smartAccountDeployed)
                return "0x";
            return (0, viem_1.concatHex)([
                factoryAddress,
                await getAccountInitCode(viemSigner.address, index)
            ]);
        },
        async getFactory() {
            if (smartAccountDeployed)
                return undefined;
            smartAccountDeployed = await (0, isSmartAccountDeployed_1.isSmartAccountDeployed)(client, accountAddress);
            if (smartAccountDeployed)
                return undefined;
            return factoryAddress;
        },
        async getFactoryData() {
            if (smartAccountDeployed)
                return undefined;
            smartAccountDeployed = await (0, isSmartAccountDeployed_1.isSmartAccountDeployed)(client, accountAddress);
            if (smartAccountDeployed)
                return undefined;
            return getAccountInitCode(viemSigner.address, index);
        },
        async encodeDeployCallData(_) {
            throw new Error("Simple account doesn't support account deployment");
        },
        async encodeCallData(args) {
            if (Array.isArray(args)) {
                const argsArray = args;
                if ((0, utils_1.getEntryPointVersion)(entryPointAddress) === "v0.6") {
                    return (0, viem_1.encodeFunctionData)({
                        abi: [
                            {
                                inputs: [
                                    {
                                        internalType: "address[]",
                                        name: "dest",
                                        type: "address[]"
                                    },
                                    {
                                        internalType: "bytes[]",
                                        name: "func",
                                        type: "bytes[]"
                                    }
                                ],
                                name: "executeBatch",
                                outputs: [],
                                stateMutability: "nonpayable",
                                type: "function"
                            }
                        ],
                        functionName: "executeBatch",
                        args: [
                            argsArray.map((a) => a.to),
                            argsArray.map((a) => a.data)
                        ]
                    });
                }
                return (0, viem_1.encodeFunctionData)({
                    abi: [
                        {
                            inputs: [
                                {
                                    internalType: "address[]",
                                    name: "dest",
                                    type: "address[]"
                                },
                                {
                                    internalType: "uint256[]",
                                    name: "value",
                                    type: "uint256[]"
                                },
                                {
                                    internalType: "bytes[]",
                                    name: "func",
                                    type: "bytes[]"
                                }
                            ],
                            name: "executeBatch",
                            outputs: [],
                            stateMutability: "nonpayable",
                            type: "function"
                        }
                    ],
                    functionName: "executeBatch",
                    args: [
                        argsArray.map((a) => a.to),
                        argsArray.map((a) => a.value),
                        argsArray.map((a) => a.data)
                    ]
                });
            }
            const { to, value, data } = args;
            return (0, viem_1.encodeFunctionData)({
                abi: [
                    {
                        inputs: [
                            {
                                internalType: "address",
                                name: "dest",
                                type: "address"
                            },
                            {
                                internalType: "uint256",
                                name: "value",
                                type: "uint256"
                            },
                            {
                                internalType: "bytes",
                                name: "func",
                                type: "bytes"
                            }
                        ],
                        name: "execute",
                        outputs: [],
                        stateMutability: "nonpayable",
                        type: "function"
                    }
                ],
                functionName: "execute",
                args: [to, value, data]
            });
        },
        async getDummySignature(_userOperation) {
            return "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c";
        }
    });
}
exports.signerToSimpleSmartAccount = signerToSimpleSmartAccount;
//# sourceMappingURL=signerToSimpleSmartAccount.js.map