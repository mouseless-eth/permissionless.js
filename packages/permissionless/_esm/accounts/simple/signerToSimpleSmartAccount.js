import { concatHex, encodeFunctionData } from "viem";
import { getChainId, signMessage } from "viem/actions";
import { getAccountNonce } from "../../actions/public/getAccountNonce.js";
import { getSenderAddress } from "../../actions/public/getSenderAddress.js";
import { getEntryPointVersion } from "../../utils/index.js";
import { getUserOperationHash } from "../../utils/getUserOperationHash.js";
import { isSmartAccountDeployed } from "../../utils/isSmartAccountDeployed.js";
import { toSmartAccount } from "../toSmartAccount.js";
import { SignTransactionNotSupportedBySmartAccount } from "../types.js";
const getAccountInitCode = async (owner, index = BigInt(0)) => {
    if (!owner)
        throw new Error("Owner account not found");
    return encodeFunctionData({
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
    const entryPointVersion = getEntryPointVersion(entryPointAddress);
    const factoryData = await getAccountInitCode(owner, index);
    if (entryPointVersion === "v0.6") {
        return getSenderAddress(client, {
            initCode: concatHex([factoryAddress, factoryData]),
            entryPoint: entryPointAddress
        });
    }
    // Get the sender address based on the init code
    return getSenderAddress(client, {
        factory: factoryAddress,
        factoryData,
        entryPoint: entryPointAddress
    });
};
/**
 * @description Creates an Simple Account from a private key.
 *
 * @returns A Private Key Simple Account.
 */
export async function signerToSimpleSmartAccount(client, { signer, factoryAddress, entryPoint: entryPointAddress, index = BigInt(0), address }) {
    const viemSigner = {
        ...signer,
        signTransaction: (_, __) => {
            throw new SignTransactionNotSupportedBySmartAccount();
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
        client.chain?.id ?? getChainId(client)
    ]);
    if (!accountAddress)
        throw new Error("Account address not found");
    let smartAccountDeployed = await isSmartAccountDeployed(client, accountAddress);
    return toSmartAccount({
        address: accountAddress,
        signMessage: async (_) => {
            throw new Error("Simple account isn't 1271 compliant");
        },
        signTransaction: (_, __) => {
            throw new SignTransactionNotSupportedBySmartAccount();
        },
        signTypedData: async (_) => {
            throw new Error("Simple account isn't 1271 compliant");
        },
        client: client,
        publicKey: accountAddress,
        entryPoint: entryPointAddress,
        source: "SimpleSmartAccount",
        async getNonce() {
            return getAccountNonce(client, {
                sender: accountAddress,
                entryPoint: entryPointAddress
            });
        },
        async signUserOperation(userOperation) {
            return signMessage(client, {
                account: viemSigner,
                message: {
                    raw: getUserOperationHash({
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
            smartAccountDeployed = await isSmartAccountDeployed(client, accountAddress);
            if (smartAccountDeployed)
                return "0x";
            return concatHex([
                factoryAddress,
                await getAccountInitCode(viemSigner.address, index)
            ]);
        },
        async getFactory() {
            if (smartAccountDeployed)
                return undefined;
            smartAccountDeployed = await isSmartAccountDeployed(client, accountAddress);
            if (smartAccountDeployed)
                return undefined;
            return factoryAddress;
        },
        async getFactoryData() {
            if (smartAccountDeployed)
                return undefined;
            smartAccountDeployed = await isSmartAccountDeployed(client, accountAddress);
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
                if (getEntryPointVersion(entryPointAddress) === "v0.6") {
                    return encodeFunctionData({
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
                return encodeFunctionData({
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
            return encodeFunctionData({
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
//# sourceMappingURL=signerToSimpleSmartAccount.js.map