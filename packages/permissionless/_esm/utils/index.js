import { deepHexlify, transactionReceiptStatus } from "./deepHexlify.js";
import { getAddressFromInitCodeOrPaymasterAndData } from "./getAddressFromInitCodeOrPaymasterAndData.js";
import { getRequiredPrefund } from "./getRequiredPrefund.js";
import { getUserOperationHash } from "./getUserOperationHash.js";
import { isSmartAccountDeployed } from "./isSmartAccountDeployed.js";
import { providerToSmartAccountSigner } from "./providerToSmartAccountSigner.js";
import { AccountOrClientNotFoundError, signUserOperationHashWithECDSA } from "./signUserOperationHashWithECDSA.js";
import { walletClientToSmartAccountSigner } from "./walletClientToSmartAccountSigner.js";
export function parseAccount(account) {
    if (typeof account === "string")
        return { address: account, type: "json-rpc" };
    return account;
}
import { ENTRYPOINT_ADDRESS_V06, ENTRYPOINT_ADDRESS_V07, getEntryPointVersion } from "./getEntryPointVersion.js";
import { getPackedUserOperation } from "./getPackedUserOperation.js";
export { transactionReceiptStatus, deepHexlify, getUserOperationHash, getRequiredPrefund, walletClientToSmartAccountSigner, signUserOperationHashWithECDSA, AccountOrClientNotFoundError, isSmartAccountDeployed, providerToSmartAccountSigner, getAddressFromInitCodeOrPaymasterAndData, getPackedUserOperation, getEntryPointVersion, ENTRYPOINT_ADDRESS_V06, ENTRYPOINT_ADDRESS_V07 };
//# sourceMappingURL=index.js.map