"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENTRYPOINT_ADDRESS_V07 = exports.ENTRYPOINT_ADDRESS_V06 = exports.getEntryPointVersion = exports.getPackedUserOperation = exports.getAddressFromInitCodeOrPaymasterAndData = exports.providerToSmartAccountSigner = exports.isSmartAccountDeployed = exports.AccountOrClientNotFoundError = exports.signUserOperationHashWithECDSA = exports.walletClientToSmartAccountSigner = exports.getRequiredPrefund = exports.getUserOperationHash = exports.deepHexlify = exports.transactionReceiptStatus = exports.parseAccount = void 0;
const deepHexlify_1 = require("./deepHexlify.js");
Object.defineProperty(exports, "deepHexlify", { enumerable: true, get: function () { return deepHexlify_1.deepHexlify; } });
Object.defineProperty(exports, "transactionReceiptStatus", { enumerable: true, get: function () { return deepHexlify_1.transactionReceiptStatus; } });
const getAddressFromInitCodeOrPaymasterAndData_1 = require("./getAddressFromInitCodeOrPaymasterAndData.js");
Object.defineProperty(exports, "getAddressFromInitCodeOrPaymasterAndData", { enumerable: true, get: function () { return getAddressFromInitCodeOrPaymasterAndData_1.getAddressFromInitCodeOrPaymasterAndData; } });
const getRequiredPrefund_1 = require("./getRequiredPrefund.js");
Object.defineProperty(exports, "getRequiredPrefund", { enumerable: true, get: function () { return getRequiredPrefund_1.getRequiredPrefund; } });
const getUserOperationHash_1 = require("./getUserOperationHash.js");
Object.defineProperty(exports, "getUserOperationHash", { enumerable: true, get: function () { return getUserOperationHash_1.getUserOperationHash; } });
const isSmartAccountDeployed_1 = require("./isSmartAccountDeployed.js");
Object.defineProperty(exports, "isSmartAccountDeployed", { enumerable: true, get: function () { return isSmartAccountDeployed_1.isSmartAccountDeployed; } });
const providerToSmartAccountSigner_1 = require("./providerToSmartAccountSigner.js");
Object.defineProperty(exports, "providerToSmartAccountSigner", { enumerable: true, get: function () { return providerToSmartAccountSigner_1.providerToSmartAccountSigner; } });
const signUserOperationHashWithECDSA_1 = require("./signUserOperationHashWithECDSA.js");
Object.defineProperty(exports, "AccountOrClientNotFoundError", { enumerable: true, get: function () { return signUserOperationHashWithECDSA_1.AccountOrClientNotFoundError; } });
Object.defineProperty(exports, "signUserOperationHashWithECDSA", { enumerable: true, get: function () { return signUserOperationHashWithECDSA_1.signUserOperationHashWithECDSA; } });
const walletClientToSmartAccountSigner_1 = require("./walletClientToSmartAccountSigner.js");
Object.defineProperty(exports, "walletClientToSmartAccountSigner", { enumerable: true, get: function () { return walletClientToSmartAccountSigner_1.walletClientToSmartAccountSigner; } });
function parseAccount(account) {
    if (typeof account === "string")
        return { address: account, type: "json-rpc" };
    return account;
}
exports.parseAccount = parseAccount;
const getEntryPointVersion_1 = require("./getEntryPointVersion.js");
Object.defineProperty(exports, "ENTRYPOINT_ADDRESS_V06", { enumerable: true, get: function () { return getEntryPointVersion_1.ENTRYPOINT_ADDRESS_V06; } });
Object.defineProperty(exports, "ENTRYPOINT_ADDRESS_V07", { enumerable: true, get: function () { return getEntryPointVersion_1.ENTRYPOINT_ADDRESS_V07; } });
Object.defineProperty(exports, "getEntryPointVersion", { enumerable: true, get: function () { return getEntryPointVersion_1.getEntryPointVersion; } });
const getPackedUserOperation_1 = require("./getPackedUserOperation.js");
Object.defineProperty(exports, "getPackedUserOperation", { enumerable: true, get: function () { return getPackedUserOperation_1.getPackedUserOperation; } });
//# sourceMappingURL=index.js.map