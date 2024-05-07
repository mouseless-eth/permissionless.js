import { signerToSafeSmartAccount } from "permissionless/accounts";
import { smartAccountConnectorHelper } from "./simpleSmartAccount.js";
export async function safeSmartAccount({ publicClient, signer, bundlerTransport, sponsorUserOperation, ...rest }) {
    return smartAccountConnectorHelper({
        account: await signerToSafeSmartAccount(publicClient, {
            ...rest,
            signer
        }),
        publicClient,
        bundlerTransport,
        sponsorUserOperation
    });
}
//# sourceMappingURL=safeSmartAccount.js.map