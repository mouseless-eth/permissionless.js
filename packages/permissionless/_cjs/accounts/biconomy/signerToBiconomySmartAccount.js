"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signerToBiconomySmartAccount = void 0;
const viem_1 = require("viem");
const actions_1 = require("viem/actions");
const getAccountNonce_1 = require("../../actions/public/getAccountNonce.js");
const utils_1 = require("../../utils/index.js");
const getUserOperationHash_1 = require("../../utils/getUserOperationHash.js");
const isSmartAccountDeployed_1 = require("../../utils/isSmartAccountDeployed.js");
const toSmartAccount_1 = require("../toSmartAccount.js");
const types_1 = require("../types.js");
const BiconomySmartAccountAbi_1 = require("./abi/BiconomySmartAccountAbi.js");
const createAccountAbi = [
    {
        inputs: [
            {
                internalType: "address",
                name: "moduleSetupContract",
                type: "address"
            },
            {
                internalType: "bytes",
                name: "moduleSetupData",
                type: "bytes"
            },
            {
                internalType: "uint256",
                name: "index",
                type: "uint256"
            }
        ],
        name: "deployCounterFactualAccount",
        outputs: [
            {
                internalType: "address",
                name: "proxy",
                type: "address"
            }
        ],
        stateMutability: "nonpayable",
        type: "function"
    }
];
const BICONOMY_ADDRESSES = {
    ECDSA_OWNERSHIP_REGISTRY_MODULE: "0x0000001c5b32F37F5beA87BDD5374eB2aC54eA8e",
    ACCOUNT_V2_0_LOGIC: "0x0000002512019Dafb59528B82CB92D3c5D2423aC",
    FACTORY_ADDRESS: "0x000000a56Aaca3e9a4C479ea6b6CD0DbcB6634F5",
    DEFAULT_FALLBACK_HANDLER_ADDRESS: "0x0bBa6d96BD616BedC6BFaa341742FD43c60b83C1"
};
const BICONOMY_PROXY_CREATION_CODE = "0x6080346100aa57601f61012038819003918201601f19168301916001600160401b038311848410176100af578084926020946040528339810103126100aa57516001600160a01b0381168082036100aa5715610065573055604051605a90816100c68239f35b60405162461bcd60e51b815260206004820152601e60248201527f496e76616c696420696d706c656d656e746174696f6e206164647265737300006044820152606490fd5b600080fd5b634e487b7160e01b600052604160045260246000fdfe608060405230546000808092368280378136915af43d82803e156020573d90f35b3d90fdfea2646970667358221220a03b18dce0be0b4c9afe58a9eb85c35205e2cf087da098bbf1d23945bf89496064736f6c63430008110033";
const getAccountInitCode = async ({ owner, index, ecdsaModuleAddress }) => {
    if (!owner)
        throw new Error("Owner account not found");
    const ecdsaOwnershipInitData = (0, viem_1.encodeFunctionData)({
        abi: BiconomySmartAccountAbi_1.BiconomyInitAbi,
        functionName: "initForSmartAccount",
        args: [owner]
    });
    return (0, viem_1.encodeFunctionData)({
        abi: createAccountAbi,
        functionName: "deployCounterFactualAccount",
        args: [ecdsaModuleAddress, ecdsaOwnershipInitData, index]
    });
};
const getAccountAddress = async ({ factoryAddress, accountLogicAddress, fallbackHandlerAddress, ecdsaModuleAddress, owner, index = BigInt(0) }) => {
    const ecdsaOwnershipInitData = (0, viem_1.encodeFunctionData)({
        abi: BiconomySmartAccountAbi_1.BiconomyInitAbi,
        functionName: "initForSmartAccount",
        args: [owner]
    });
    const initialisationData = (0, viem_1.encodeFunctionData)({
        abi: BiconomySmartAccountAbi_1.BiconomyInitAbi,
        functionName: "init",
        args: [
            fallbackHandlerAddress,
            ecdsaModuleAddress,
            ecdsaOwnershipInitData
        ]
    });
    const deploymentCode = (0, viem_1.encodePacked)(["bytes", "uint256"], [BICONOMY_PROXY_CREATION_CODE, (0, viem_1.hexToBigInt)(accountLogicAddress)]);
    const salt = (0, viem_1.keccak256)((0, viem_1.encodePacked)(["bytes32", "uint256"], [(0, viem_1.keccak256)((0, viem_1.encodePacked)(["bytes"], [initialisationData])), index]));
    return (0, viem_1.getContractAddress)({
        from: factoryAddress,
        salt,
        bytecode: deploymentCode,
        opcode: "CREATE2"
    });
};
async function signerToBiconomySmartAccount(client, { signer, address, entryPoint: entryPointAddress, index = BigInt(0), factoryAddress = BICONOMY_ADDRESSES.FACTORY_ADDRESS, accountLogicAddress = BICONOMY_ADDRESSES.ACCOUNT_V2_0_LOGIC, fallbackHandlerAddress = BICONOMY_ADDRESSES.DEFAULT_FALLBACK_HANDLER_ADDRESS, ecdsaModuleAddress = BICONOMY_ADDRESSES.ECDSA_OWNERSHIP_REGISTRY_MODULE }) {
    const entryPointVersion = (0, utils_1.getEntryPointVersion)(entryPointAddress);
    if (entryPointVersion !== "v0.6") {
        throw new Error("Only EntryPoint 0.6 is supported");
    }
    const viemSigner = {
        ...signer,
        signTransaction: (_, __) => {
            throw new types_1.SignTransactionNotSupportedBySmartAccount();
        }
    };
    const generateInitCode = () => getAccountInitCode({
        owner: viemSigner.address,
        index,
        ecdsaModuleAddress
    });
    const [accountAddress, chainId] = await Promise.all([
        address ??
            getAccountAddress({
                owner: viemSigner.address,
                ecdsaModuleAddress,
                factoryAddress,
                accountLogicAddress,
                fallbackHandlerAddress,
                index
            }),
        client.chain?.id ?? (0, actions_1.getChainId)(client)
    ]);
    if (!accountAddress)
        throw new Error("Account address not found");
    let smartAccountDeployed = await (0, isSmartAccountDeployed_1.isSmartAccountDeployed)(client, accountAddress);
    return (0, toSmartAccount_1.toSmartAccount)({
        address: accountAddress,
        async signMessage({ message }) {
            let signature = await (0, actions_1.signMessage)(client, {
                account: viemSigner,
                message
            });
            const potentiallyIncorrectV = parseInt(signature.slice(-2), 16);
            if (![27, 28].includes(potentiallyIncorrectV)) {
                const correctV = potentiallyIncorrectV + 27;
                signature = (signature.slice(0, -2) +
                    correctV.toString(16));
            }
            return (0, viem_1.encodeAbiParameters)([{ type: "bytes" }, { type: "address" }], [signature, ecdsaModuleAddress]);
        },
        async signTransaction(_, __) {
            throw new types_1.SignTransactionNotSupportedBySmartAccount();
        },
        async signTypedData(typedData) {
            let signature = await (0, actions_1.signTypedData)(client, {
                account: viemSigner,
                ...typedData
            });
            const potentiallyIncorrectV = parseInt(signature.slice(-2), 16);
            if (![27, 28].includes(potentiallyIncorrectV)) {
                const correctV = potentiallyIncorrectV + 27;
                signature = (signature.slice(0, -2) +
                    correctV.toString(16));
            }
            return (0, viem_1.encodeAbiParameters)([{ type: "bytes" }, { type: "address" }], [signature, ecdsaModuleAddress]);
        },
        client: client,
        publicKey: accountAddress,
        entryPoint: entryPointAddress,
        source: "biconomySmartAccount",
        async getNonce() {
            return (0, getAccountNonce_1.getAccountNonce)(client, {
                sender: accountAddress,
                entryPoint: entryPointAddress
            });
        },
        async signUserOperation(userOperation) {
            const hash = (0, getUserOperationHash_1.getUserOperationHash)({
                userOperation: {
                    ...userOperation,
                    signature: "0x"
                },
                entryPoint: entryPointAddress,
                chainId: chainId
            });
            const signature = await (0, actions_1.signMessage)(client, {
                account: viemSigner,
                message: { raw: hash }
            });
            const signatureWithModuleAddress = (0, viem_1.encodeAbiParameters)((0, viem_1.parseAbiParameters)("bytes, address"), [signature, ecdsaModuleAddress]);
            return signatureWithModuleAddress;
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
            return generateInitCode();
        },
        async getInitCode() {
            if (smartAccountDeployed)
                return "0x";
            smartAccountDeployed = await (0, isSmartAccountDeployed_1.isSmartAccountDeployed)(client, accountAddress);
            if (smartAccountDeployed)
                return "0x";
            return (0, viem_1.concatHex)([factoryAddress, await generateInitCode()]);
        },
        async encodeDeployCallData(_) {
            throw new Error("Doesn't support account deployment");
        },
        async encodeCallData(args) {
            if (Array.isArray(args)) {
                const argsArray = args;
                return (0, viem_1.encodeFunctionData)({
                    abi: BiconomySmartAccountAbi_1.BiconomyExecuteAbi,
                    functionName: "executeBatch_y6U",
                    args: [
                        argsArray.map((a) => a.to),
                        argsArray.map((a) => a.value),
                        argsArray.map((a) => a.data)
                    ]
                });
            }
            const { to, value, data } = args;
            return (0, viem_1.encodeFunctionData)({
                abi: BiconomySmartAccountAbi_1.BiconomyExecuteAbi,
                functionName: "execute_ncC",
                args: [to, value, data]
            });
        },
        async getDummySignature(_userOperation) {
            const moduleAddress = BICONOMY_ADDRESSES.ECDSA_OWNERSHIP_REGISTRY_MODULE;
            const dynamicPart = moduleAddress.substring(2).padEnd(40, "0");
            return `0x0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000${dynamicPart}000000000000000000000000000000000000000000000000000000000000004181d4b4981670cb18f99f0b4a66446df1bf5b204d24cfcb659bf38ba27a4359b5711649ec2423c5e1247245eba2964679b6a1dbb85c992ae40b9b00c6935b02ff1b00000000000000000000000000000000000000000000000000000000000000`;
        }
    });
}
exports.signerToBiconomySmartAccount = signerToBiconomySmartAccount;
//# sourceMappingURL=signerToBiconomySmartAccount.js.map