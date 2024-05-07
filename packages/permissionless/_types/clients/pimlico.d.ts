import type { Account, Chain, Client, PublicClientConfig, Transport } from "viem";
import type { EntryPoint } from "../types/entrypoint";
import type { PimlicoBundlerRpcSchema, PimlicoPaymasterRpcSchema } from "../types/pimlico";
import { type BundlerActions } from "./decorators/bundler";
import { type PimlicoBundlerActions, type PimlicoPaymasterClientActions } from "./decorators/pimlico";
export type PimlicoBundlerClient<entryPoint extends EntryPoint> = Client<Transport, Chain | undefined, Account | undefined, PimlicoBundlerRpcSchema, PimlicoBundlerActions & BundlerActions<entryPoint>>;
export type PimlicoPaymasterClient<entryPoint extends EntryPoint> = Client<Transport, Chain | undefined, Account | undefined, PimlicoPaymasterRpcSchema<entryPoint>, PimlicoPaymasterClientActions<entryPoint>>;
/**
 * Creates a pimlico specific Bundler Client with a given [Transport](https://viem.sh/docs/clients/intro.html) configured for a [Chain](https://viem.sh/docs/clients/chains.html).
 *
 * - Docs: https://docs.pimlico.io/permissionless/reference/clients/pimlicoBundlerClient
 *
 * A Pimlico Client is an interface to "pimlico endpoints" [JSON-RPC API](https://docs.pimlico.io/reference/bundler/endpoints) methods such as getting current blockchain gas prices, getting user operation status, etc through [Pimlico Bundler Actions](TODO://Add bundler action documentation link).
 *
 * @param config - {@link PublicClientConfig}
 * @returns A Pimlico Bundler Client. {@link PimlicoBundlerClient}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 *
 * const pimlicoBundlerClient = createPimlicoBundlerClient({
 *   chain: mainnet,
 *   transport: http("https://api.pimlico.io/v2/goerli/rpc?apikey=YOUR_API_KEY_HERE"),
 * })
 */
export declare const createPimlicoBundlerClient: <entryPoint extends EntryPoint, transport extends Transport = Transport, chain extends Chain | undefined = undefined>(parameters: {
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
}) => PimlicoBundlerClient<entryPoint>;
/**
 * Creates a pimlico specific Paymaster Client with a given [Transport](https://viem.sh/docs/clients/intro.html) configured for a [Chain](https://viem.sh/docs/clients/chains.html).
 *
 * - Docs: https://docs.pimlico.io/permissionless/reference/clients/pimlicoPaymasterClient
 *
 * A Pimlico Paymaster Client is an interface to "pimlico paymaster endpoints" [JSON-RPC API](https://docs.pimlico.io/reference/verifying-paymaster/endpoints) methods such as sponsoring user operation, etc through Pimlico Paymaster Actions.
 *
 * @param config - {@link PublicClientConfig}
 * @returns A Pimlico Paymaster Client. {@link PimlicoPaymasterClient}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 *
 * const pimlicoPaymasterClient = createPimlicoPaymasterClient({
 *   chain: mainnet,
 *   transport: http("https://api.pimlico.io/v2/goerli/rpc?apikey=YOUR_API_KEY_HERE"),
 * })
 */
export declare const createPimlicoPaymasterClient: <entryPoint extends EntryPoint, transport extends Transport = Transport, chain extends Chain | undefined = undefined>(parameters: {
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
}) => PimlicoPaymasterClient<entryPoint>;
//# sourceMappingURL=pimlico.d.ts.map