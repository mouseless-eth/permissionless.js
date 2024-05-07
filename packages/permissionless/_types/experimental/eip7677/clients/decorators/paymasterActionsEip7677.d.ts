import type { Chain, Client, Transport } from "viem";
import type { Prettify } from "viem/types/utils";
import type { EntryPoint } from "../../../../types/entrypoint";
import { type GetPaymasterDataParameters, type GetPaymasterDataReturnType } from "../../actions/getPaymasterData";
import { type GetPaymasterStubDataParameters, type GetPaymasterStubDataReturnType } from "../../actions/getPaymasterStubData";
export type PaymasterActionsEip7677<TEntryPoint extends EntryPoint, TChain extends Chain | undefined = Chain | undefined> = {
    getPaymasterData: <TChainOverride extends Chain | undefined = Chain | undefined>(args: Omit<GetPaymasterDataParameters<TEntryPoint, TChain, TChainOverride>, "entryPoint">) => Promise<GetPaymasterDataReturnType<TEntryPoint>>;
    getPaymasterStubData: <TChainOverride extends Chain | undefined = Chain | undefined>(args: Prettify<Omit<GetPaymasterStubDataParameters<TEntryPoint, TChain, TChainOverride>, "entryPoint">>) => Promise<GetPaymasterStubDataReturnType<TEntryPoint>>;
};
declare const paymasterActionsEip7677: <TEntryPoint extends EntryPoint>({ entryPoint }: {
    entryPoint: TEntryPoint;
}) => <TTransport extends Transport, TChain extends Chain | undefined = Chain | undefined>(client: Client<TTransport, TChain>) => PaymasterActionsEip7677<TEntryPoint, TChain>;
export { paymasterActionsEip7677 };
//# sourceMappingURL=paymasterActionsEip7677.d.ts.map