"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareUserOperationRequest = void 0;
const actions_1 = require("viem/actions");
const utils_1 = require("viem/utils");
const utils_2 = require("../../utils/index.js");
const getEntryPointVersion_1 = require("../../utils/getEntryPointVersion.js");
const estimateUserOperationGas_1 = require("../bundler/estimateUserOperationGas.js");
async function prepareUserOperationRequestForEntryPointV06(client, args, stateOverrides) {
    const { account: account_ = client.account, userOperation: partialUserOperation, middleware } = args;
    if (!account_)
        throw new utils_2.AccountOrClientNotFoundError();
    const account = (0, utils_2.parseAccount)(account_);
    const [sender, nonce, initCode, callData] = await Promise.all([
        partialUserOperation.sender || account.address,
        partialUserOperation.nonce || account.getNonce(),
        partialUserOperation.initCode || account.getInitCode(),
        partialUserOperation.callData
    ]);
    const userOperation = {
        sender,
        nonce,
        initCode,
        callData,
        paymasterAndData: "0x",
        signature: partialUserOperation.signature || "0x",
        maxFeePerGas: partialUserOperation.maxFeePerGas || BigInt(0),
        maxPriorityFeePerGas: partialUserOperation.maxPriorityFeePerGas || BigInt(0),
        callGasLimit: partialUserOperation.callGasLimit || BigInt(0),
        verificationGasLimit: partialUserOperation.verificationGasLimit || BigInt(0),
        preVerificationGas: partialUserOperation.preVerificationGas || BigInt(0)
    };
    if (userOperation.signature === "0x") {
        userOperation.signature = await account.getDummySignature(userOperation);
    }
    if (typeof middleware === "function") {
        return middleware({
            userOperation,
            entryPoint: account.entryPoint
        });
    }
    if (middleware && typeof middleware !== "function" && middleware.gasPrice) {
        const gasPrice = await middleware.gasPrice();
        userOperation.maxFeePerGas = gasPrice.maxFeePerGas;
        userOperation.maxPriorityFeePerGas = gasPrice.maxPriorityFeePerGas;
    }
    if (!userOperation.maxFeePerGas || !userOperation.maxPriorityFeePerGas) {
        const estimateGas = await (0, actions_1.estimateFeesPerGas)(account.client);
        userOperation.maxFeePerGas =
            userOperation.maxFeePerGas || estimateGas.maxFeePerGas;
        userOperation.maxPriorityFeePerGas =
            userOperation.maxPriorityFeePerGas ||
                estimateGas.maxPriorityFeePerGas;
    }
    if (middleware &&
        typeof middleware !== "function" &&
        middleware.sponsorUserOperation) {
        const sponsorUserOperationData = (await middleware.sponsorUserOperation({
            userOperation,
            entryPoint: account.entryPoint
        }));
        userOperation.callGasLimit = sponsorUserOperationData.callGasLimit;
        userOperation.verificationGasLimit =
            sponsorUserOperationData.verificationGasLimit;
        userOperation.preVerificationGas =
            sponsorUserOperationData.preVerificationGas;
        userOperation.paymasterAndData =
            sponsorUserOperationData.paymasterAndData;
        userOperation.maxFeePerGas =
            sponsorUserOperationData.maxFeePerGas || userOperation.maxFeePerGas;
        userOperation.maxPriorityFeePerGas =
            sponsorUserOperationData.maxPriorityFeePerGas ||
                userOperation.maxPriorityFeePerGas;
        return userOperation;
    }
    if (!userOperation.callGasLimit ||
        !userOperation.verificationGasLimit ||
        !userOperation.preVerificationGas) {
        const gasParameters = await (0, utils_1.getAction)(client, estimateUserOperationGas_1.estimateUserOperationGas, "estimateUserOperationGas")({
            userOperation,
            entryPoint: account.entryPoint
        }, stateOverrides);
        userOperation.callGasLimit |= gasParameters.callGasLimit;
        userOperation.verificationGasLimit =
            userOperation.verificationGasLimit ||
                gasParameters.verificationGasLimit;
        userOperation.preVerificationGas =
            userOperation.preVerificationGas || gasParameters.preVerificationGas;
    }
    return userOperation;
}
async function prepareUserOperationRequestEntryPointV07(client, args, stateOverrides) {
    const { account: account_ = client.account, userOperation: partialUserOperation, middleware } = args;
    if (!account_)
        throw new utils_2.AccountOrClientNotFoundError();
    const account = (0, utils_2.parseAccount)(account_);
    const [sender, nonce, factory, factoryData, callData, gasEstimation] = await Promise.all([
        partialUserOperation.sender || account.address,
        partialUserOperation.nonce || account.getNonce(),
        partialUserOperation.factory || account.getFactory(),
        partialUserOperation.factoryData || account.getFactoryData(),
        partialUserOperation.callData,
        !partialUserOperation.maxFeePerGas ||
            !partialUserOperation.maxPriorityFeePerGas
            ? (0, actions_1.estimateFeesPerGas)(account.client)
            : undefined
    ]);
    const userOperation = {
        sender,
        nonce,
        factory: factory,
        factoryData: factoryData,
        callData,
        callGasLimit: partialUserOperation.callGasLimit || BigInt(0),
        verificationGasLimit: partialUserOperation.verificationGasLimit || BigInt(0),
        preVerificationGas: partialUserOperation.preVerificationGas || BigInt(0),
        maxFeePerGas: partialUserOperation.maxFeePerGas ||
            gasEstimation?.maxFeePerGas ||
            BigInt(0),
        maxPriorityFeePerGas: partialUserOperation.maxPriorityFeePerGas ||
            gasEstimation?.maxPriorityFeePerGas ||
            BigInt(0),
        signature: partialUserOperation.signature || "0x"
    };
    if (userOperation.signature === "0x") {
        userOperation.signature = await account.getDummySignature(userOperation);
    }
    if (typeof middleware === "function") {
        return middleware({
            userOperation,
            entryPoint: account.entryPoint
        });
    }
    if (middleware && typeof middleware !== "function" && middleware.gasPrice) {
        const gasPrice = await middleware.gasPrice();
        userOperation.maxFeePerGas = gasPrice.maxFeePerGas;
        userOperation.maxPriorityFeePerGas = gasPrice.maxPriorityFeePerGas;
    }
    if (!userOperation.maxFeePerGas || !userOperation.maxPriorityFeePerGas) {
        const estimateGas = await (0, actions_1.estimateFeesPerGas)(account.client);
        userOperation.maxFeePerGas =
            userOperation.maxFeePerGas || estimateGas.maxFeePerGas;
        userOperation.maxPriorityFeePerGas =
            userOperation.maxPriorityFeePerGas ||
                estimateGas.maxPriorityFeePerGas;
    }
    if (middleware &&
        typeof middleware !== "function" &&
        middleware.sponsorUserOperation) {
        const sponsorUserOperationData = (await middleware.sponsorUserOperation({
            userOperation,
            entryPoint: account.entryPoint
        }));
        userOperation.callGasLimit = sponsorUserOperationData.callGasLimit;
        userOperation.verificationGasLimit =
            sponsorUserOperationData.verificationGasLimit;
        userOperation.preVerificationGas =
            sponsorUserOperationData.preVerificationGas;
        userOperation.paymaster = sponsorUserOperationData.paymaster;
        userOperation.paymasterVerificationGasLimit =
            sponsorUserOperationData.paymasterVerificationGasLimit;
        userOperation.paymasterPostOpGasLimit =
            sponsorUserOperationData.paymasterPostOpGasLimit;
        userOperation.paymasterData = sponsorUserOperationData.paymasterData;
        userOperation.maxFeePerGas =
            sponsorUserOperationData.maxFeePerGas || userOperation.maxFeePerGas;
        userOperation.maxPriorityFeePerGas =
            sponsorUserOperationData.maxPriorityFeePerGas ||
                userOperation.maxPriorityFeePerGas;
        return userOperation;
    }
    if (!userOperation.callGasLimit ||
        !userOperation.verificationGasLimit ||
        !userOperation.preVerificationGas) {
        const gasParameters = await (0, utils_1.getAction)(client, (estimateUserOperationGas_1.estimateUserOperationGas), "estimateUserOperationGas")({
            userOperation,
            entryPoint: account.entryPoint
        }, stateOverrides);
        userOperation.callGasLimit |= gasParameters.callGasLimit;
        userOperation.verificationGasLimit =
            userOperation.verificationGasLimit ||
                gasParameters.verificationGasLimit;
        userOperation.preVerificationGas =
            userOperation.preVerificationGas || gasParameters.preVerificationGas;
        userOperation.paymasterPostOpGasLimit =
            userOperation.paymasterPostOpGasLimit ||
                gasParameters.paymasterPostOpGasLimit;
        userOperation.paymasterPostOpGasLimit =
            userOperation.paymasterPostOpGasLimit ||
                gasParameters.paymasterPostOpGasLimit;
    }
    return userOperation;
}
async function prepareUserOperationRequest(client, args, stateOverrides) {
    const { account: account_ = client.account } = args;
    if (!account_)
        throw new utils_2.AccountOrClientNotFoundError();
    const account = (0, utils_2.parseAccount)(account_);
    const entryPointVersion = (0, getEntryPointVersion_1.getEntryPointVersion)(account.entryPoint);
    if (entryPointVersion === "v0.6") {
        return prepareUserOperationRequestForEntryPointV06(client, args, stateOverrides);
    }
    return prepareUserOperationRequestEntryPointV07(client, args, stateOverrides);
}
exports.prepareUserOperationRequest = prepareUserOperationRequest;
//# sourceMappingURL=prepareUserOperationRequest.js.map