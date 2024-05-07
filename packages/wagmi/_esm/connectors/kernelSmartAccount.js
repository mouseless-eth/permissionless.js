import { signerToEcdsaKernelSmartAccount } from "permissionless/accounts";
import { smartAccountConnectorHelper } from "./simpleSmartAccount.js";
export async function kernelSmartAccount({ publicClient, signer, bundlerTransport, sponsorUserOperation, ...rest }) {
    return smartAccountConnectorHelper({
        account: await signerToEcdsaKernelSmartAccount(publicClient, {
            ...rest,
            signer
        }),
        publicClient,
        bundlerTransport,
        sponsorUserOperation
    });
}
//# sourceMappingURL=kernelSmartAccount.js.map