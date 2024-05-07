import { type Account, type Chain, type Client, type PublicClientConfig, type Transport } from "viem";
import type { EntryPoint } from "../types/entrypoint";
import type { StackupPaymasterRpcSchema } from "../types/stackup";
import { type BundlerActions } from "./decorators/bundler";
import { type StackupPaymasterClientActions } from "./decorators/stackup";
export type StackupPaymasterClient<entryPoint extends EntryPoint> = Client<Transport, Chain | undefined, Account | undefined, StackupPaymasterRpcSchema<entryPoint>, StackupPaymasterClientActions<entryPoint> & BundlerActions<entryPoint>>;
/**
 * Creates a Stackup specific Paymaster Client with a given [Transport](https://viem.sh/docs/clients/intro.html) configured for a [Chain](https://viem.sh/docs/clients/chains.html).
 *
 * - Docs: https://docs.pimlico.io/permissionless/reference/clients/stackupPaymasterClient
 *
 * A Stackup Paymaster Client is an interface to "stackup paymaster endpoints" [JSON-RPC API](https://docs.stackup.sh/docs/paymaster-api-rpc-methods) methods such as sponsoring user operation, etc through Stackup Paymaster Actions.
 *
 * @param config - {@link PublicClientConfig}
 * @returns A Stackup Paymaster Client. {@link StackupPaymasterClient}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 *
 * const stackupPaymasterClient = createStackupPaymasterClient({
 *   chain: mainnet,
 *   transport: http("https://api.stackup.sh/v2/paymaster/YOUR_API_KEY_HERE"),
 * })
 */
export declare const createStackupPaymasterClient: <entryPoint extends EntryPoint, transport extends Transport = Transport, chain extends Chain | undefined = undefined>(parameters: {
    batch?: {
        multicall?: boolean | {
            batchSize?: number | undefined;
            wait?: number | undefined;
        } | undefined;
    } | undefined;
    cacheTime?: number | undefined;
    ccipRead?: false | {
        request?: ((parameters: import("viem").CcipRequestParameters) => Promise<`0x${string}`>) | undefined;
    } | undefined;
    chain?: Chain | chain | undefined;
    key?: string | undefined;
    name?: string | undefined;
    pollingInterval?: number | undefined;
    transport: transport;
} & {
    entryPoint: entryPoint;
}) => StackupPaymasterClient<entryPoint>;
//# sourceMappingURL=stackup.d.ts.map