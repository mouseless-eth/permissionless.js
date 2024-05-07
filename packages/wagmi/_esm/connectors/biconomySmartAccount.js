import { signerToBiconomySmartAccount } from "permissionless/accounts";
import { smartAccountConnectorHelper } from "./simpleSmartAccount.js";
export async function biconomySmartAccount({ publicClient, signer, bundlerTransport, sponsorUserOperation, ...rest }) {
    return smartAccountConnectorHelper({
        account: await signerToBiconomySmartAccount(publicClient, {
            ...rest,
            signer
        }),
        publicClient,
        bundlerTransport,
        sponsorUserOperation
    });
}
//# sourceMappingURL=biconomySmartAccount.js.map