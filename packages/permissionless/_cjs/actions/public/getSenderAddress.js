"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSenderAddress = exports.InvalidEntryPointError = void 0;
const viem_1 = require("viem");
const actions_1 = require("viem/actions");
const utils_1 = require("viem/utils");
class InvalidEntryPointError extends viem_1.BaseError {
    constructor({ cause, entryPoint } = {}) {
        super(`The entry point address (\`entryPoint\`${entryPoint ? ` = ${entryPoint}` : ""}) is not a valid entry point. getSenderAddress did not revert with a SenderAddressResult error.`, {
            cause
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "InvalidEntryPointError"
        });
    }
}
exports.InvalidEntryPointError = InvalidEntryPointError;
const getSenderAddress = async (client, args) => {
    const { initCode, entryPoint, factory, factoryData } = args;
    if (!initCode && !factory && !factoryData) {
        throw new Error("Either `initCode` or `factory` and `factoryData` must be provided");
    }
    try {
        await (0, utils_1.getAction)(client, actions_1.simulateContract, "simulateContract")({
            address: entryPoint,
            abi: [
                {
                    inputs: [
                        {
                            internalType: "address",
                            name: "sender",
                            type: "address"
                        }
                    ],
                    name: "SenderAddressResult",
                    type: "error"
                },
                {
                    inputs: [
                        {
                            internalType: "bytes",
                            name: "initCode",
                            type: "bytes"
                        }
                    ],
                    name: "getSenderAddress",
                    outputs: [],
                    stateMutability: "nonpayable",
                    type: "function"
                }
            ],
            functionName: "getSenderAddress",
            args: [initCode || (0, viem_1.concat)([factory, factoryData])]
        });
    }
    catch (e) {
        const err = e;
        if (err.cause.name === "ContractFunctionRevertedError") {
            const revertError = err.cause;
            const errorName = revertError.data?.errorName ?? "";
            if (errorName === "SenderAddressResult" &&
                revertError.data?.args &&
                revertError.data?.args[0]) {
                return revertError.data?.args[0];
            }
        }
        if (err.cause.name === "CallExecutionError") {
            const callExecutionError = err.cause;
            if (callExecutionError.cause.name === "RpcRequestError") {
                const revertError = callExecutionError.cause;
                const data = revertError.cause.data.split(" ")[1];
                const error = (0, viem_1.decodeErrorResult)({
                    abi: [
                        {
                            inputs: [
                                {
                                    internalType: "address",
                                    name: "sender",
                                    type: "address"
                                }
                            ],
                            name: "SenderAddressResult",
                            type: "error"
                        }
                    ],
                    data
                });
                return error.args[0];
            }
            if (callExecutionError.cause.name === "InvalidInputRpcError") {
                const revertError = callExecutionError.cause;
                const data = revertError.cause.data;
                const error = (0, viem_1.decodeErrorResult)({
                    abi: [
                        {
                            inputs: [
                                {
                                    internalType: "address",
                                    name: "sender",
                                    type: "address"
                                }
                            ],
                            name: "SenderAddressResult",
                            type: "error"
                        }
                    ],
                    data
                });
                return error.args[0];
            }
        }
        throw e;
    }
    throw new InvalidEntryPointError({ entryPoint });
};
exports.getSenderAddress = getSenderAddress;
//# sourceMappingURL=getSenderAddress.js.map