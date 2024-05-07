import { type Chain, type Client, type GetChainParameter, type Hex, type Transport } from "viem";
import type { EntryPoint, GetEntryPointVersion } from "../../../types/entrypoint";
import type { UserOperation } from "../../../types/userOperation";
import type { Eip7677RpcSchema } from "../types/paymaster";
export type GetPaymasterDataParameters<TEntryPoint extends EntryPoint, TChain extends Chain | undefined = Chain | undefined, TChainOverride extends Chain | undefined = Chain | undefined> = {
    userOperation: UserOperation<GetEntryPointVersion<TEntryPoint>>;
    entryPoint: TEntryPoint;
    context?: Record<string, unknown>;
} & GetChainParameter<TChain, TChainOverride>;
export type GetPaymasterDataReturnType<TEntryPoint extends EntryPoint> = GetEntryPointVersion<TEntryPoint> extends "v0.6" ? {
    paymasterAndData: Hex;
} : {
    paymaster: Hex;
    paymasterData: Hex;
};
export declare function getPaymasterData<TEntryPoint extends EntryPoint, TChain extends Chain | undefined, TTransport extends Transport = Transport, TChainOverride extends Chain | undefined = Chain | undefined>(client: Client<TTransport, TChain, undefined, Eip7677RpcSchema<TEntryPoint>>, { userOperation, entryPoint, context, chain }: GetPaymasterDataParameters<TEntryPoint, TChain, TChainOverride>): Promise<GetPaymasterDataReturnType<TEntryPoint>>;
//# sourceMappingURL=getPaymasterData.d.ts.map