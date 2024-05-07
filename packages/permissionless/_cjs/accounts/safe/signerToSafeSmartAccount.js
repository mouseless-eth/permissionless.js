"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signerToSafeSmartAccount = void 0;
const viem_1 = require("viem");
const actions_1 = require("viem/actions");
const getAccountNonce_1 = require("../../actions/public/getAccountNonce.js");
const getEntryPointVersion_1 = require("../../utils/getEntryPointVersion.js");
const isSmartAccountDeployed_1 = require("../../utils/isSmartAccountDeployed.js");
const toSmartAccount_1 = require("../toSmartAccount.js");
const types_1 = require("../types.js");
const EIP712_SAFE_OPERATION_TYPE_V06 = {
    SafeOp: [
        { type: "address", name: "safe" },
        { type: "uint256", name: "nonce" },
        { type: "bytes", name: "initCode" },
        { type: "bytes", name: "callData" },
        { type: "uint256", name: "callGasLimit" },
        { type: "uint256", name: "verificationGasLimit" },
        { type: "uint256", name: "preVerificationGas" },
        { type: "uint256", name: "maxFeePerGas" },
        { type: "uint256", name: "maxPriorityFeePerGas" },
        { type: "bytes", name: "paymasterAndData" },
        { type: "uint48", name: "validAfter" },
        { type: "uint48", name: "validUntil" },
        { type: "address", name: "entryPoint" }
    ]
};
const EIP712_SAFE_OPERATION_TYPE_V07 = {
    SafeOp: [
        { type: "address", name: "safe" },
        { type: "uint256", name: "nonce" },
        { type: "bytes", name: "initCode" },
        { type: "bytes", name: "callData" },
        { type: "uint128", name: "verificationGasLimit" },
        { type: "uint128", name: "callGasLimit" },
        { type: "uint256", name: "preVerificationGas" },
        { type: "uint128", name: "maxPriorityFeePerGas" },
        { type: "uint128", name: "maxFeePerGas" },
        { type: "bytes", name: "paymasterAndData" },
        { type: "uint48", name: "validAfter" },
        { type: "uint48", name: "validUntil" },
        { type: "address", name: "entryPoint" }
    ]
};
const SAFE_VERSION_TO_ADDRESSES_MAP = {
    "1.4.1": {
        "v0.6": {
            SAFE_MODULE_SETUP_ADDRESS: "0x8EcD4ec46D4D2a6B64fE960B3D64e8B94B2234eb",
            SAFE_4337_MODULE_ADDRESS: "0xa581c4A4DB7175302464fF3C06380BC3270b4037",
            SAFE_PROXY_FACTORY_ADDRESS: "0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67",
            SAFE_SINGLETON_ADDRESS: "0x41675C099F32341bf84BFc5382aF534df5C7461a",
            MULTI_SEND_ADDRESS: "0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526",
            MULTI_SEND_CALL_ONLY_ADDRESS: "0x9641d764fc13c8B624c04430C7356C1C7C8102e2"
        },
        "v0.7": {
            SAFE_MODULE_SETUP_ADDRESS: "0x2dd68b007B46fBe91B9A7c3EDa5A7a1063cB5b47",
            SAFE_4337_MODULE_ADDRESS: "0x75cf11467937ce3F2f357CE24ffc3DBF8fD5c226",
            SAFE_PROXY_FACTORY_ADDRESS: "0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67",
            SAFE_SINGLETON_ADDRESS: "0x41675C099F32341bf84BFc5382aF534df5C7461a",
            MULTI_SEND_ADDRESS: "0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526",
            MULTI_SEND_CALL_ONLY_ADDRESS: "0x9641d764fc13c8B624c04430C7356C1C7C8102e2"
        }
    }
};
const adjustVInSignature = (signingMethod, signature) => {
    const ETHEREUM_V_VALUES = [0, 1, 27, 28];
    const MIN_VALID_V_VALUE_FOR_SAFE_ECDSA = 27;
    let signatureV = parseInt(signature.slice(-2), 16);
    if (!ETHEREUM_V_VALUES.includes(signatureV)) {
        throw new Error("Invalid signature");
    }
    if (signingMethod === "eth_sign") {
        if (signatureV < MIN_VALID_V_VALUE_FOR_SAFE_ECDSA) {
            signatureV += MIN_VALID_V_VALUE_FOR_SAFE_ECDSA;
        }
        signatureV += 4;
    }
    if (signingMethod === "eth_signTypedData") {
        if (signatureV < MIN_VALID_V_VALUE_FOR_SAFE_ECDSA) {
            signatureV += MIN_VALID_V_VALUE_FOR_SAFE_ECDSA;
        }
    }
    return (signature.slice(0, -2) + signatureV.toString(16));
};
const generateSafeMessageMessage = (message) => {
    const signableMessage = message;
    if (typeof signableMessage === "string" || signableMessage.raw) {
        return (0, viem_1.hashMessage)(signableMessage);
    }
    return (0, viem_1.hashTypedData)(message);
};
const encodeInternalTransaction = (tx) => {
    const encoded = (0, viem_1.encodePacked)(["uint8", "address", "uint256", "uint256", "bytes"], [
        tx.operation,
        tx.to,
        tx.value,
        BigInt(tx.data.slice(2).length / 2),
        tx.data
    ]);
    return encoded.slice(2);
};
const encodeMultiSend = (txs) => {
    const data = `0x${txs
        .map((tx) => encodeInternalTransaction(tx))
        .join("")}`;
    return (0, viem_1.encodeFunctionData)({
        abi: [
            {
                inputs: [
                    {
                        internalType: "bytes",
                        name: "transactions",
                        type: "bytes"
                    }
                ],
                name: "multiSend",
                outputs: [],
                stateMutability: "payable",
                type: "function"
            }
        ],
        functionName: "multiSend",
        args: [data]
    });
};
const getInitializerCode = async ({ owner, safeModuleSetupAddress, safe4337ModuleAddress, multiSendAddress, setupTransactions = [], safeModules = [] }) => {
    const multiSendCallData = encodeMultiSend([
        {
            to: safeModuleSetupAddress,
            data: (0, viem_1.encodeFunctionData)({
                abi: [
                    {
                        inputs: [
                            {
                                internalType: "address[]",
                                name: "modules",
                                type: "address[]"
                            }
                        ],
                        name: "enableModules",
                        outputs: [],
                        stateMutability: "nonpayable",
                        type: "function"
                    }
                ],
                functionName: "enableModules",
                args: [[safe4337ModuleAddress, ...safeModules]]
            }),
            value: BigInt(0),
            operation: 1
        },
        ...setupTransactions.map((tx) => ({ ...tx, operation: 0 }))
    ]);
    return (0, viem_1.encodeFunctionData)({
        abi: [
            {
                inputs: [
                    {
                        internalType: "address[]",
                        name: "_owners",
                        type: "address[]"
                    },
                    {
                        internalType: "uint256",
                        name: "_threshold",
                        type: "uint256"
                    },
                    {
                        internalType: "address",
                        name: "to",
                        type: "address"
                    },
                    {
                        internalType: "bytes",
                        name: "data",
                        type: "bytes"
                    },
                    {
                        internalType: "address",
                        name: "fallbackHandler",
                        type: "address"
                    },
                    {
                        internalType: "address",
                        name: "paymentToken",
                        type: "address"
                    },
                    {
                        internalType: "uint256",
                        name: "payment",
                        type: "uint256"
                    },
                    {
                        internalType: "address payable",
                        name: "paymentReceiver",
                        type: "address"
                    }
                ],
                name: "setup",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function"
            }
        ],
        functionName: "setup",
        args: [
            [owner],
            BigInt(1),
            multiSendAddress,
            multiSendCallData,
            safe4337ModuleAddress,
            viem_1.zeroAddress,
            BigInt(0),
            viem_1.zeroAddress
        ]
    });
};
function getPaymasterAndData(unpackedUserOperation) {
    return unpackedUserOperation.paymaster
        ? (0, viem_1.concat)([
            unpackedUserOperation.paymaster,
            (0, viem_1.pad)((0, viem_1.toHex)(unpackedUserOperation.paymasterVerificationGasLimit ||
                BigInt(0)), {
                size: 16
            }),
            (0, viem_1.pad)((0, viem_1.toHex)(unpackedUserOperation.paymasterPostOpGasLimit || BigInt(0)), {
                size: 16
            }),
            unpackedUserOperation.paymasterData || "0x"
        ])
        : "0x";
}
const getAccountInitCode = async ({ owner, safeModuleSetupAddress, safe4337ModuleAddress, safeSingletonAddress, multiSendAddress, saltNonce = BigInt(0), setupTransactions = [], safeModules = [] }) => {
    if (!owner)
        throw new Error("Owner account not found");
    const initializer = await getInitializerCode({
        owner,
        safeModuleSetupAddress,
        safe4337ModuleAddress,
        multiSendAddress,
        setupTransactions,
        safeModules
    });
    const initCodeCallData = (0, viem_1.encodeFunctionData)({
        abi: [
            {
                inputs: [
                    {
                        internalType: "address",
                        name: "_singleton",
                        type: "address"
                    },
                    {
                        internalType: "bytes",
                        name: "initializer",
                        type: "bytes"
                    },
                    {
                        internalType: "uint256",
                        name: "saltNonce",
                        type: "uint256"
                    }
                ],
                name: "createProxyWithNonce",
                outputs: [
                    {
                        internalType: "contract SafeProxy",
                        name: "proxy",
                        type: "address"
                    }
                ],
                stateMutability: "nonpayable",
                type: "function"
            }
        ],
        functionName: "createProxyWithNonce",
        args: [safeSingletonAddress, initializer, saltNonce]
    });
    return initCodeCallData;
};
const getAccountAddress = async ({ client, owner, safeModuleSetupAddress, safe4337ModuleAddress, safeProxyFactoryAddress, safeSingletonAddress, multiSendAddress, setupTransactions = [], safeModules = [], saltNonce = BigInt(0) }) => {
    const proxyCreationCode = await (0, actions_1.readContract)(client, {
        abi: [
            {
                inputs: [],
                name: "proxyCreationCode",
                outputs: [
                    {
                        internalType: "bytes",
                        name: "",
                        type: "bytes"
                    }
                ],
                stateMutability: "pure",
                type: "function"
            }
        ],
        address: safeProxyFactoryAddress,
        functionName: "proxyCreationCode"
    });
    const deploymentCode = (0, viem_1.encodePacked)(["bytes", "uint256"], [proxyCreationCode, (0, viem_1.hexToBigInt)(safeSingletonAddress)]);
    const initializer = await getInitializerCode({
        owner,
        safeModuleSetupAddress,
        safe4337ModuleAddress,
        multiSendAddress,
        setupTransactions,
        safeModules
    });
    const salt = (0, viem_1.keccak256)((0, viem_1.encodePacked)(["bytes32", "uint256"], [(0, viem_1.keccak256)((0, viem_1.encodePacked)(["bytes"], [initializer])), saltNonce]));
    return (0, viem_1.getContractAddress)({
        from: safeProxyFactoryAddress,
        salt,
        bytecode: deploymentCode,
        opcode: "CREATE2"
    });
};
const getDefaultAddresses = (safeVersion, entryPointAddress, { addModuleLibAddress: _addModuleLibAddress, safeModuleSetupAddress: _safeModuleSetupAddress, safe4337ModuleAddress: _safe4337ModuleAddress, safeProxyFactoryAddress: _safeProxyFactoryAddress, safeSingletonAddress: _safeSingletonAddress, multiSendAddress: _multiSendAddress, multiSendCallOnlyAddress: _multiSendCallOnlyAddress }) => {
    const entryPointVersion = (0, getEntryPointVersion_1.getEntryPointVersion)(entryPointAddress);
    const safeModuleSetupAddress = _safeModuleSetupAddress ??
        _addModuleLibAddress ??
        SAFE_VERSION_TO_ADDRESSES_MAP[safeVersion][entryPointVersion]
            .SAFE_MODULE_SETUP_ADDRESS;
    const safe4337ModuleAddress = _safe4337ModuleAddress ??
        SAFE_VERSION_TO_ADDRESSES_MAP[safeVersion][entryPointVersion]
            .SAFE_4337_MODULE_ADDRESS;
    const safeProxyFactoryAddress = _safeProxyFactoryAddress ??
        SAFE_VERSION_TO_ADDRESSES_MAP[safeVersion][entryPointVersion]
            .SAFE_PROXY_FACTORY_ADDRESS;
    const safeSingletonAddress = _safeSingletonAddress ??
        SAFE_VERSION_TO_ADDRESSES_MAP[safeVersion][entryPointVersion]
            .SAFE_SINGLETON_ADDRESS;
    const multiSendAddress = _multiSendAddress ??
        SAFE_VERSION_TO_ADDRESSES_MAP[safeVersion][entryPointVersion]
            .MULTI_SEND_ADDRESS;
    const multiSendCallOnlyAddress = _multiSendCallOnlyAddress ??
        SAFE_VERSION_TO_ADDRESSES_MAP[safeVersion][(0, getEntryPointVersion_1.getEntryPointVersion)(entryPointAddress)].MULTI_SEND_CALL_ONLY_ADDRESS;
    return {
        safeModuleSetupAddress,
        safe4337ModuleAddress,
        safeProxyFactoryAddress,
        safeSingletonAddress,
        multiSendAddress,
        multiSendCallOnlyAddress
    };
};
async function signerToSafeSmartAccount(client, { signer, address, safeVersion, entryPoint: entryPointAddress, safeModuleSetupAddress: _safeModuleSetupAddress, safe4337ModuleAddress: _safe4337ModuleAddress, safeProxyFactoryAddress: _safeProxyFactoryAddress, safeSingletonAddress: _safeSingletonAddress, multiSendAddress: _multiSendAddress, multiSendCallOnlyAddress: _multiSendCallOnlyAddress, saltNonce = BigInt(0), validUntil = 0, validAfter = 0, safeModules = [], setupTransactions = [] }) {
    const chainId = client.chain?.id ?? (await (0, actions_1.getChainId)(client));
    const viemSigner = {
        ...signer,
        signTransaction: (_, __) => {
            throw new types_1.SignTransactionNotSupportedBySmartAccount();
        }
    };
    const { safeModuleSetupAddress, safe4337ModuleAddress, safeProxyFactoryAddress, safeSingletonAddress, multiSendAddress, multiSendCallOnlyAddress } = getDefaultAddresses(safeVersion, entryPointAddress, {
        safeModuleSetupAddress: _safeModuleSetupAddress,
        safe4337ModuleAddress: _safe4337ModuleAddress,
        safeProxyFactoryAddress: _safeProxyFactoryAddress,
        safeSingletonAddress: _safeSingletonAddress,
        multiSendAddress: _multiSendAddress,
        multiSendCallOnlyAddress: _multiSendCallOnlyAddress
    });
    const accountAddress = address ??
        (await getAccountAddress({
            client,
            owner: viemSigner.address,
            safeModuleSetupAddress,
            safe4337ModuleAddress,
            safeProxyFactoryAddress,
            safeSingletonAddress,
            multiSendAddress,
            saltNonce,
            setupTransactions,
            safeModules
        }));
    if (!accountAddress)
        throw new Error("Account address not found");
    let safeDeployed = await (0, isSmartAccountDeployed_1.isSmartAccountDeployed)(client, accountAddress);
    const safeSmartAccount = (0, toSmartAccount_1.toSmartAccount)({
        address: accountAddress,
        async signMessage({ message }) {
            const messageHash = (0, viem_1.hashTypedData)({
                domain: {
                    chainId: chainId,
                    verifyingContract: accountAddress
                },
                types: {
                    SafeMessage: [{ name: "message", type: "bytes" }]
                },
                primaryType: "SafeMessage",
                message: {
                    message: generateSafeMessageMessage(message)
                }
            });
            return adjustVInSignature("eth_sign", await (0, actions_1.signMessage)(client, {
                account: viemSigner,
                message: {
                    raw: (0, viem_1.toBytes)(messageHash)
                }
            }));
        },
        async signTransaction(_, __) {
            throw new types_1.SignTransactionNotSupportedBySmartAccount();
        },
        async signTypedData(typedData) {
            return adjustVInSignature("eth_signTypedData", await (0, actions_1.signTypedData)(client, {
                account: viemSigner,
                domain: {
                    chainId: chainId,
                    verifyingContract: accountAddress
                },
                types: {
                    SafeMessage: [{ name: "message", type: "bytes" }]
                },
                primaryType: "SafeMessage",
                message: {
                    message: generateSafeMessageMessage(typedData)
                }
            }));
        },
        client: client,
        publicKey: accountAddress,
        entryPoint: entryPointAddress,
        source: "SafeSmartAccount",
        async getNonce() {
            return (0, getAccountNonce_1.getAccountNonce)(client, {
                sender: accountAddress,
                entryPoint: entryPointAddress
            });
        },
        async signUserOperation(userOperation) {
            const message = {
                safe: accountAddress,
                callData: userOperation.callData,
                nonce: userOperation.nonce,
                initCode: userOperation.initCode ?? "0x",
                maxFeePerGas: userOperation.maxFeePerGas,
                maxPriorityFeePerGas: userOperation.maxPriorityFeePerGas,
                preVerificationGas: userOperation.preVerificationGas,
                verificationGasLimit: userOperation.verificationGasLimit,
                callGasLimit: userOperation.callGasLimit,
                paymasterAndData: userOperation.paymasterAndData ?? "0x",
                validAfter: validAfter,
                validUntil: validUntil,
                entryPoint: entryPointAddress
            };
            if ((0, getEntryPointVersion_1.isUserOperationVersion06)(entryPointAddress, userOperation)) {
                message.paymasterAndData = userOperation.paymasterAndData;
            }
            if ((0, getEntryPointVersion_1.isUserOperationVersion07)(entryPointAddress, userOperation)) {
                if (userOperation.factory && userOperation.factoryData) {
                    message.initCode = (0, viem_1.concatHex)([
                        userOperation.factory,
                        userOperation.factoryData
                    ]);
                }
                message.paymasterAndData =
                    getPaymasterAndData(userOperation);
            }
            const signatures = [
                {
                    signer: viemSigner.address,
                    data: await (0, actions_1.signTypedData)(client, {
                        account: viemSigner,
                        domain: {
                            chainId: chainId,
                            verifyingContract: safe4337ModuleAddress
                        },
                        types: (0, getEntryPointVersion_1.getEntryPointVersion)(entryPointAddress) ===
                            "v0.6"
                            ? EIP712_SAFE_OPERATION_TYPE_V06
                            : EIP712_SAFE_OPERATION_TYPE_V07,
                        primaryType: "SafeOp",
                        message: message
                    })
                }
            ];
            signatures.sort((left, right) => left.signer
                .toLowerCase()
                .localeCompare(right.signer.toLowerCase()));
            const signatureBytes = (0, viem_1.concat)(signatures.map((sig) => sig.data));
            return (0, viem_1.encodePacked)(["uint48", "uint48", "bytes"], [validAfter, validUntil, signatureBytes]);
        },
        async getInitCode() {
            safeDeployed =
                safeDeployed ||
                    (await (0, isSmartAccountDeployed_1.isSmartAccountDeployed)(client, accountAddress));
            if (safeDeployed)
                return "0x";
            return (0, viem_1.concatHex)([
                (await this.getFactory()) ?? "0x",
                (await this.getFactoryData()) ?? "0x"
            ]);
        },
        async getFactory() {
            safeDeployed =
                safeDeployed ||
                    (await (0, isSmartAccountDeployed_1.isSmartAccountDeployed)(client, accountAddress));
            if (safeDeployed)
                return undefined;
            return safeProxyFactoryAddress;
        },
        async getFactoryData() {
            safeDeployed =
                safeDeployed ||
                    (await (0, isSmartAccountDeployed_1.isSmartAccountDeployed)(client, accountAddress));
            if (safeDeployed)
                return undefined;
            return await getAccountInitCode({
                owner: viemSigner.address,
                safeModuleSetupAddress,
                safe4337ModuleAddress,
                safeSingletonAddress,
                multiSendAddress,
                saltNonce,
                setupTransactions,
                safeModules
            });
        },
        async encodeDeployCallData(_) {
            throw new Error("Safe account doesn't support account deployment");
        },
        async encodeCallData(args) {
            let to;
            let value;
            let data;
            let operationType = 0;
            if (Array.isArray(args)) {
                const argsArray = args;
                to = multiSendCallOnlyAddress;
                value = BigInt(0);
                data = encodeMultiSend(argsArray.map((tx) => ({ ...tx, operation: 0 })));
                operationType = 1;
            }
            else {
                const singleTransaction = args;
                to = singleTransaction.to;
                data = singleTransaction.data;
                value = singleTransaction.value;
            }
            return (0, viem_1.encodeFunctionData)({
                abi: [
                    {
                        inputs: [
                            {
                                internalType: "address",
                                name: "to",
                                type: "address"
                            },
                            {
                                internalType: "uint256",
                                name: "value",
                                type: "uint256"
                            },
                            {
                                internalType: "bytes",
                                name: "data",
                                type: "bytes"
                            },
                            {
                                internalType: "uint8",
                                name: "operation",
                                type: "uint8"
                            }
                        ],
                        name: "executeUserOpWithErrorString",
                        outputs: [],
                        stateMutability: "nonpayable",
                        type: "function"
                    }
                ],
                functionName: "executeUserOpWithErrorString",
                args: [to, value, data, operationType]
            });
        },
        async getDummySignature(_userOperation) {
            return "0x000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
        }
    });
    return safeSmartAccount;
}
exports.signerToSafeSmartAccount = signerToSafeSmartAccount;
//# sourceMappingURL=signerToSafeSmartAccount.js.map