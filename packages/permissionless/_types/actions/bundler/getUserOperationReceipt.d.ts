import type { Account, Address, Chain, Client, Hash, Hex, Transport } from "viem";
import type { Prettify } from "../../types";
import type { BundlerRpcSchema } from "../../types/bundler";
import type { EntryPoint } from "../../types/entrypoint";
import type { TStatus } from "../../types/userOperation";
export type GetUserOperationReceiptParameters = {
    hash: Hash;
};
export type GetUserOperationReceiptReturnType = {
    userOpHash: Hash;
    entryPoint: Address;
    sender: Address;
    nonce: bigint;
    paymaster?: Address;
    actualGasUsed: bigint;
    actualGasCost: bigint;
    success: boolean;
    reason?: string;
    receipt: {
        transactionHash: Hex;
        transactionIndex: bigint;
        blockHash: Hash;
        blockNumber: bigint;
        from: Address;
        to: Address | null;
        cumulativeGasUsed: bigint;
        status: TStatus;
        gasUsed: bigint;
        contractAddress: Address | null;
        logsBloom: Hex;
        effectiveGasPrice: bigint;
    };
    logs: {
        data: Hex;
        blockNumber: bigint;
        blockHash: Hash;
        transactionHash: Hash;
        logIndex: bigint;
        transactionIndex: bigint;
        address: Address;
        topics: Hex[];
    }[];
};
/**
 * Returns the user operation receipt from userOpHash
 *
 * - Docs: https://docs.pimlico.io/permissionless/reference/bundler-actions/getUserOperationReceipt
 *
 * @param client {@link BundlerClient} that you created using viem's createClient and extended it with bundlerActions.
 * @param args {@link GetUserOperationReceiptParameters} UserOpHash that was returned by {@link sendUserOperation}
 * @returns user operation receipt {@link GetUserOperationReceiptReturnType} if found or null
 *
 *
 * @example
 * import { createClient } from "viem"
 * import { getUserOperationReceipt } from "permissionless/actions"
 *
 * const bundlerClient = createClient({
 *      chain: goerli,
 *      transport: http(BUNDLER_URL)
 * })
 *
 * getUserOperationReceipt(bundlerClient, {hash: userOpHash})
 *
 */
export declare const getUserOperationReceipt: <entryPoint extends EntryPoint, TTransport extends Transport = Transport, TChain extends Chain | undefined = Chain | undefined, TAccount extends Account | undefined = Account | undefined>(client: Client<TTransport, TChain, TAccount, BundlerRpcSchema<entryPoint>>, { hash }: Prettify<GetUserOperationReceiptParameters>) => Promise<Prettify<GetUserOperationReceiptReturnType> | null>;
//# sourceMappingURL=getUserOperationReceipt.d.ts.map