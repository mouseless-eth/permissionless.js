import type { Account, Address, Chain, Client, Hex, Transport } from "viem";
import type { PartialBy } from "viem/types/utils";
import type { Prettify } from "../../types";
import type { ENTRYPOINT_ADDRESS_V06_TYPE, EntryPoint } from "../../types/entrypoint";
import type { PimlicoPaymasterRpcSchema } from "../../types/pimlico";
import type { UserOperation } from "../../types/userOperation";
export type PimlicoSponsorUserOperationParameters<entryPoint extends EntryPoint> = {
    userOperation: entryPoint extends ENTRYPOINT_ADDRESS_V06_TYPE ? PartialBy<UserOperation<"v0.6">, "callGasLimit" | "preVerificationGas" | "verificationGasLimit"> : PartialBy<UserOperation<"v0.7">, "callGasLimit" | "preVerificationGas" | "verificationGasLimit" | "paymasterVerificationGasLimit" | "paymasterPostOpGasLimit">;
    entryPoint: entryPoint;
    sponsorshipPolicyId?: string;
};
export type SponsorUserOperationReturnType<entryPoint extends EntryPoint> = entryPoint extends ENTRYPOINT_ADDRESS_V06_TYPE ? {
    callGasLimit: bigint;
    verificationGasLimit: bigint;
    preVerificationGas: bigint;
    paymasterAndData: Hex;
} : {
    callGasLimit: bigint;
    verificationGasLimit: bigint;
    preVerificationGas: bigint;
    paymaster: Address;
    paymasterVerificationGasLimit: bigint;
    paymasterPostOpGasLimit: bigint;
    paymasterData: Hex;
};
/**
 * Returns paymasterAndData & updated gas parameters required to sponsor a userOperation.
 *
 * - Docs: https://docs.pimlico.io/permissionless/reference/pimlico-paymaster-actions/sponsorUserOperation
 *
 * @param client {@link PimlicoBundlerClient} that you created using viem's createClient whose transport url is pointing to the Pimlico's bundler.
 * @param args {@link PimlicoSponsorUserOperationParameters} UserOperation you want to sponsor & entryPoint.
 * @returns paymasterAndData & updated gas parameters, see {@link SponsorUserOperationReturnType}
 *
 *
 * @example
 * import { createClient } from "viem"
 * import { sponsorUserOperation } from "permissionless/actions/pimlico"
 *
 * const bundlerClient = createClient({
 *      chain: goerli,
 *      transport: http("https://api.pimlico.io/v2/goerli/rpc?apikey=YOUR_API_KEY_HERE")
 * })
 *
 * await sponsorUserOperation(bundlerClient, {
 *      userOperation: userOperationWithDummySignature,
 *      entryPoint: entryPoint
 * }})
 *
 */
export declare const sponsorUserOperation: <entryPoint extends EntryPoint, TTransport extends Transport = Transport, TChain extends Chain | undefined = Chain | undefined, TAccount extends Account | undefined = Account | undefined>(client: Client<TTransport, TChain, TAccount, PimlicoPaymasterRpcSchema<entryPoint>>, args: {
    userOperation: entryPoint extends "0x94BFb82d788b874F35b823390eAECaafEf855Fdb" ? PartialBy<{
        sender: `0x${string}`;
        nonce: bigint;
        initCode: `0x${string}`;
        callData: `0x${string}`;
        callGasLimit: bigint;
        verificationGasLimit: bigint;
        preVerificationGas: bigint;
        maxFeePerGas: bigint;
        maxPriorityFeePerGas: bigint;
        paymasterAndData: `0x${string}`;
        signature: `0x${string}`;
        factory?: undefined;
        factoryData?: undefined;
        paymaster?: undefined;
        paymasterVerificationGasLimit?: undefined;
        paymasterPostOpGasLimit?: undefined;
        paymasterData?: undefined;
    }, "callGasLimit" | "preVerificationGas" | "verificationGasLimit"> : PartialBy<{
        sender: `0x${string}`;
        nonce: bigint;
        factory?: `0x${string}` | undefined;
        factoryData?: `0x${string}` | undefined;
        callData: `0x${string}`;
        callGasLimit: bigint;
        verificationGasLimit: bigint;
        preVerificationGas: bigint;
        maxFeePerGas: bigint;
        maxPriorityFeePerGas: bigint;
        paymaster?: `0x${string}` | undefined;
        paymasterVerificationGasLimit?: bigint | undefined;
        paymasterPostOpGasLimit?: bigint | undefined;
        paymasterData?: `0x${string}` | undefined;
        signature: `0x${string}`;
        initCode?: undefined;
        paymasterAndData?: undefined;
    }, "callGasLimit" | "preVerificationGas" | "verificationGasLimit" | "paymasterVerificationGasLimit" | "paymasterPostOpGasLimit">;
    entryPoint: entryPoint;
    sponsorshipPolicyId?: string | undefined;
}) => Promise<SponsorUserOperationReturnType<entryPoint> extends infer T ? { [K in keyof T]: SponsorUserOperationReturnType<entryPoint>[K]; } : never>;
//# sourceMappingURL=sponsorUserOperation.d.ts.map