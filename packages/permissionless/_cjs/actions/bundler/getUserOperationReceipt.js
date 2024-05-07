"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserOperationReceipt = void 0;
const deepHexlify_1 = require("../../utils/deepHexlify.js");
const getUserOperationReceipt = async (client, { hash }) => {
    const params = [hash];
    const response = await client.request({
        method: "eth_getUserOperationReceipt",
        params
    });
    if (!response)
        return null;
    const userOperationReceipt = {
        userOpHash: response.userOpHash,
        entryPoint: response.entryPoint,
        sender: response.sender,
        nonce: BigInt(response.nonce),
        paymaster: response.paymaster,
        actualGasUsed: BigInt(response.actualGasUsed),
        actualGasCost: BigInt(response.actualGasCost),
        success: response.success,
        reason: response.reason,
        receipt: {
            transactionHash: response.receipt.transactionHash,
            transactionIndex: BigInt(response.receipt.transactionIndex),
            blockHash: response.receipt.blockHash,
            blockNumber: BigInt(response.receipt.blockNumber),
            from: response.receipt.from,
            to: response.receipt.to,
            cumulativeGasUsed: BigInt(response.receipt.cumulativeGasUsed),
            status: deepHexlify_1.transactionReceiptStatus[response.receipt.status],
            gasUsed: BigInt(response.receipt.gasUsed),
            contractAddress: response.receipt.contractAddress,
            logsBloom: response.receipt.logsBloom,
            effectiveGasPrice: BigInt(response.receipt.effectiveGasPrice)
        },
        logs: response.logs.map((log) => ({
            data: log.data,
            blockNumber: BigInt(log.blockNumber),
            blockHash: log.blockHash,
            transactionHash: log.transactionHash,
            logIndex: BigInt(log.logIndex),
            transactionIndex: BigInt(log.transactionIndex),
            address: log.address,
            topics: log.topics
        }))
    };
    return userOperationReceipt;
};
exports.getUserOperationReceipt = getUserOperationReceipt;
//# sourceMappingURL=getUserOperationReceipt.js.map