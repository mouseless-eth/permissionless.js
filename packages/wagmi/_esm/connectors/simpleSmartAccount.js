import { createSmartAccountClient } from "permissionless";
import { signerToSimpleSmartAccount } from "permissionless/accounts";
import {} from "permissionless/actions/smartAccount";
import { smartAccount } from "./smartAccount.js";
export async function smartAccountConnectorHelper({ bundlerTransport, sponsorUserOperation, account }) {
    const smartAccountClient = createSmartAccountClient({
        account,
        transport: bundlerTransport,
        sponsorUserOperation: sponsorUserOperation
    });
    return smartAccount({
        smartAccountClient: smartAccountClient
    });
}
export async function simpleSmartAccount({ publicClient, signer, bundlerTransport, sponsorUserOperation, ...rest }) {
    return smartAccountConnectorHelper({
        account: await signerToSimpleSmartAccount(publicClient, {
            ...rest,
            signer
        }),
        publicClient,
        bundlerTransport,
        sponsorUserOperation
    });
}
//# sourceMappingURL=simpleSmartAccount.js.map