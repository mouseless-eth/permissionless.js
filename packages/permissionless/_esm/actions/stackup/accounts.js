/**
 * Returns all the Paymaster addresses associated with an EntryPoint that’s owned by this service.
 *
 * https://docs.stackup.sh/docs/paymaster-api-rpc-methods#pm_accounts
 *
 * @param args {@link AccountsParameters} entryPoint for which you want to get list of supported paymasters.
 * @returns paymaster addresses
 *
 * @example
 * import { createClient } from "viem"
 * import { accounts } from "permissionless/actions/stackup"
 *
 * const bundlerClient = createClient({
 *      chain: goerli,
 *      transport: http("https://api.stackup.sh/v2/paymaster/YOUR_API_KEY_HERE")
 * })
 *
 * await accounts(bundlerClient, {
 *      entryPoint: entryPoint
 * }})
 *
 */
export const accounts = async (client, { entryPoint: entryPointAddress }) => {
    const response = await client.request({
        method: "pm_accounts",
        params: [entryPointAddress]
    });
    return response;
};
//# sourceMappingURL=accounts.js.map