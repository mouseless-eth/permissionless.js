import { type Chain, type Client, type GetChainParameter, type Hex, type Transport } from "viem";
import type { EntryPoint, GetEntryPointVersion } from "../../../types/entrypoint";
import type { UserOperation } from "../../../types/userOperation";
import type { Eip7677RpcSchema } from "../types/paymaster";
export type GetPaymasterStubDataParameters<TEntryPoint extends EntryPoint, TChain extends Chain | undefined, TChainOverride extends Chain | undefined = Chain | undefined> = {
    userOperation: UserOperation<GetEntryPointVersion<TEntryPoint>>;
    entryPoint: TEntryPoint;
    context?: Record<string, unknown>;
} & GetChainParameter<TChain, TChainOverride>;
export type GetPaymasterStubDataReturnType<TEntryPoint extends EntryPoint> = GetEntryPointVersion<TEntryPoint> extends "v0.6" ? {
    paymasterAndData: Hex;
} : {
    paymaster: Hex;
    paymasterData: Hex;
    paymasterVerificationGasLimit?: bigint;
    paymasterPostOpGasLimit?: bigint;
};
export declare function getPaymasterStubData<TEntryPoint extends EntryPoint, TChain extends Chain | undefined, TTransport extends Transport = Transport, TChainOverride extends Chain | undefined = Chain | undefined>(client: Client<TTransport, TChain, undefined, Eip7677RpcSchema<TEntryPoint>>, { userOperation, entryPoint, context, chain }: GetPaymasterStubDataParameters<TEntryPoint, TChain, TChainOverride>): Promise<GetPaymasterStubDataReturnType<TEntryPoint>>;
//# sourceMappingURL=getPaymasterStubData.d.ts.map