import type { Chain, Client, Hash, SendTransactionParameters, Transport } from "viem";
import type { SmartAccount } from "../../accounts/types";
import type { Prettify } from "../../types";
import type { EntryPoint } from "../../types/entrypoint";
import type { Middleware } from "./prepareUserOperationRequest";
export type SendTransactionWithPaymasterParameters<entryPoint extends EntryPoint, TChain extends Chain | undefined = Chain | undefined, TAccount extends SmartAccount<entryPoint> | undefined = SmartAccount<entryPoint> | undefined, TChainOverride extends Chain | undefined = Chain | undefined> = SendTransactionParameters<TChain, TAccount, TChainOverride> & Middleware<entryPoint>;
/**
 * Creates, signs, and sends a new transaction to the network.
 * This function also allows you to sponsor this transaction if sender is a smartAccount
 *
 * - Docs: https://viem.sh/docs/actions/wallet/sendTransaction.html
 * - Examples: https://stackblitz.com/github/wagmi-dev/viem/tree/main/examples/transactions/sending-transactions
 * - JSON-RPC Methods:
 *   - JSON-RPC Accounts: [`eth_sendTransaction`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendtransaction)
 *   - Local Accounts: [`eth_sendRawTransaction`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendrawtransaction)
 *
 * @param client - Client to use
 * @param parameters - {@link SendTransactionParameters}
 * @returns The [Transaction](https://viem.sh/docs/glossary/terms.html#transaction) hash.
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { sendTransaction } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const hash = await sendTransaction(client, {
 *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 *   value: 1000000000000000000n,
 * })
 *
 * @example
 * // Account Hoisting
 * import { createWalletClient, http } from 'viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 * import { mainnet } from 'viem/chains'
 * import { sendTransaction } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   account: privateKeyToAccount('0x…'),
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const hash = await sendTransaction(client, {
 *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 *   value: 1000000000000000000n,
 * })
 */
export declare function sendTransaction<TChain extends Chain | undefined, TAccount extends SmartAccount<entryPoint> | undefined, entryPoint extends EntryPoint, TChainOverride extends Chain | undefined = Chain | undefined>(client: Client<Transport, TChain, TAccount>, args: Prettify<SendTransactionWithPaymasterParameters<entryPoint, TChain, TAccount, TChainOverride>>): Promise<Hash>;
//# sourceMappingURL=sendTransaction.d.ts.map