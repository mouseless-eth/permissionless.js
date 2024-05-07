import { getAction } from "viem/utils";
import { AccountOrClientNotFoundError, parseAccount } from "../../utils/index.js";
import { sendUserOperation as sendUserOperationBundler } from "../bundler/sendUserOperation.js";
import { prepareUserOperationRequest } from "./prepareUserOperationRequest.js";
export async function sendUserOperation(client, args) {
    const { account: account_ = client.account } = args;
    if (!account_)
        throw new AccountOrClientNotFoundError();
    const account = parseAccount(account_);
    const userOperation = await getAction(client, (prepareUserOperationRequest), "prepareUserOperationRequest")(args);
    userOperation.signature = await account.signUserOperation(userOperation);
    return sendUserOperationBundler(client, {
        userOperation: userOperation,
        entryPoint: account.entryPoint
    });
}
//# sourceMappingURL=sendUserOperation.js.map