"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymasterStubData = void 0;
const viem_1 = require("viem");
const utils_1 = require("../../../utils/index.js");
async function getPaymasterStubData(client, { userOperation, entryPoint, context, chain }) {
    const chainId = chain?.id ?? client.chain?.id;
    if (!chainId) {
        throw new viem_1.ChainNotFoundError();
    }
    const params = context
        ? [
            (0, utils_1.deepHexlify)(userOperation),
            entryPoint,
            (0, viem_1.toHex)(chainId),
            context
        ]
        : [
            (0, utils_1.deepHexlify)(userOperation),
            entryPoint,
            (0, viem_1.toHex)(chainId)
        ];
    const response = await client.request({
        method: "pm_getPaymasterStubData",
        params
    });
    const entryPointVersion = (0, utils_1.getEntryPointVersion)(entryPoint);
    if (entryPointVersion === "v0.6") {
        const responseV06 = response;
        return {
            paymasterAndData: responseV06.paymasterAndData
        };
    }
    const responseV07 = response;
    return {
        paymaster: responseV07.paymaster,
        paymasterData: responseV07.paymasterData,
        paymasterVerificationGasLimit: responseV07.paymasterVerificationGasLimit
            ? BigInt(responseV07.paymasterVerificationGasLimit)
            : undefined,
        paymasterPostOpGasLimit: responseV07.paymasterPostOpGasLimit
            ? BigInt(responseV07.paymasterPostOpGasLimit)
            : undefined
    };
}
exports.getPaymasterStubData = getPaymasterStubData;
//# sourceMappingURL=getPaymasterStubData.js.map