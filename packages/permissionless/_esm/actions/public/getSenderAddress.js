import { BaseError, concat, decodeErrorResult } from "viem";
import { simulateContract } from "viem/actions";
import { getAction } from "viem/utils";
export class InvalidEntryPointError extends BaseError {
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
/**
 * Returns the address of the account that will be deployed with the given init code.
 *
 * - Docs: https://docs.pimlico.io/permissionless/reference/public-actions/getSenderAddress
 *
 * @param client {@link Client} that you created using viem's createPublicClient.
 * @param args {@link GetSenderAddressParams} initCode & entryPoint
 * @returns Sender's Address
 *
 * @example
 * import { createPublicClient } from "viem"
 * import { getSenderAddress } from "permissionless/actions"
 *
 * const publicClient = createPublicClient({
 *      chain: goerli,
 *      transport: http("https://goerli.infura.io/v3/your-infura-key")
 * })
 *
 * const senderAddress = await getSenderAddress(publicClient, {
 *      initCode,
 *      entryPoint
 * })
 *
 * // Return '0x7a88a206ba40b37a8c07a2b5688cf8b287318b63'
 */
export const getSenderAddress = async (client, args) => {
    const { initCode, entryPoint, factory, factoryData } = args;
    if (!initCode && !factory && !factoryData) {
        throw new Error("Either `initCode` or `factory` and `factoryData` must be provided");
    }
    try {
        await getAction(client, simulateContract, "simulateContract")({
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
            args: [initCode || concat([factory, factoryData])]
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
                // biome-ignore lint/suspicious/noExplicitAny: fuse issues
                const data = revertError.cause.data.split(" ")[1];
                const error = decodeErrorResult({
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
                //Ganache local testing returns "InvalidInputRpcError" with data in regular format
                const revertError = callExecutionError.cause;
                // biome-ignore lint/suspicious/noExplicitAny: fuse issues
                const data = revertError.cause.data;
                const error = decodeErrorResult({
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
//# sourceMappingURL=getSenderAddress.js.map