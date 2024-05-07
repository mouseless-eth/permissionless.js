import type { Chain, Client, Transport } from "viem";
import type { SmartAccount } from "../../accounts/types";
import type { PartialPick } from "../../types";
import type { GetAccountParameter, PartialBy, Prettify, UserOperation } from "../../types";
import type { StateOverrides } from "../../types/bundler";
import type { ENTRYPOINT_ADDRESS_V06_TYPE, EntryPoint, GetEntryPointVersion } from "../../types/entrypoint";
export type SponsorUserOperationReturnType<entryPoint extends EntryPoint> = entryPoint extends ENTRYPOINT_ADDRESS_V06_TYPE ? Prettify<Pick<UserOperation<"v0.6">, "callGasLimit" | "verificationGasLimit" | "preVerificationGas" | "paymasterAndData"> & PartialPick<UserOperation<"v0.6">, "maxFeePerGas" | "maxPriorityFeePerGas">> : Prettify<Pick<UserOperation<"v0.7">, "callGasLimit" | "verificationGasLimit" | "preVerificationGas" | "paymaster" | "paymasterVerificationGasLimit" | "paymasterPostOpGasLimit" | "paymasterData"> & PartialPick<UserOperation<"v0.7">, "maxFeePerGas" | "maxPriorityFeePerGas">>;
export type Middleware<entryPoint extends EntryPoint> = {
    middleware?: ((args: {
        userOperation: UserOperation<GetEntryPointVersion<entryPoint>>;
        entryPoint: entryPoint;
    }) => Promise<UserOperation<GetEntryPointVersion<entryPoint>>>) | {
        gasPrice?: () => Promise<{
            maxFeePerGas: bigint;
            maxPriorityFeePerGas: bigint;
        }>;
        sponsorUserOperation?: (args: {
            userOperation: UserOperation<GetEntryPointVersion<entryPoint>>;
            entryPoint: entryPoint;
        }) => Promise<SponsorUserOperationReturnType<entryPoint>>;
    };
};
export type PrepareUserOperationRequestParameters<entryPoint extends EntryPoint, TAccount extends SmartAccount<entryPoint> | undefined = SmartAccount<entryPoint> | undefined> = {
    userOperation: entryPoint extends ENTRYPOINT_ADDRESS_V06_TYPE ? PartialBy<UserOperation<"v0.6">, "sender" | "nonce" | "initCode" | "callGasLimit" | "verificationGasLimit" | "preVerificationGas" | "maxFeePerGas" | "maxPriorityFeePerGas" | "paymasterAndData" | "signature"> : PartialBy<UserOperation<"v0.7">, "sender" | "nonce" | "factory" | "factoryData" | "callGasLimit" | "verificationGasLimit" | "preVerificationGas" | "maxFeePerGas" | "maxPriorityFeePerGas" | "paymaster" | "paymasterVerificationGasLimit" | "paymasterPostOpGasLimit" | "paymasterData" | "signature">;
} & GetAccountParameter<entryPoint, TAccount> & Middleware<entryPoint>;
export type PrepareUserOperationRequestReturnType<entryPoint extends EntryPoint> = UserOperation<GetEntryPointVersion<entryPoint>>;
export declare function prepareUserOperationRequest<entryPoint extends EntryPoint, TTransport extends Transport = Transport, TChain extends Chain | undefined = Chain | undefined, TAccount extends SmartAccount<entryPoint> | undefined = SmartAccount<entryPoint> | undefined>(client: Client<TTransport, TChain, TAccount>, args: Prettify<PrepareUserOperationRequestParameters<entryPoint, TAccount>>, stateOverrides?: StateOverrides): Promise<Prettify<PrepareUserOperationRequestReturnType<entryPoint>>>;
//# sourceMappingURL=prepareUserOperationRequest.d.ts.map