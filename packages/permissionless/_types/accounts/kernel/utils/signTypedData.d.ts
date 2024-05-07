import { type Account, type Chain, type Client, type SignTypedDataParameters, type SignTypedDataReturnType, type Transport, type TypedData } from "viem";
import { type WrapMessageHashParams } from "./wrapMessageHash";
export declare function signTypedData<const typedData extends TypedData | Record<string, unknown>, primaryType extends keyof typedData | "EIP712Domain", chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: SignTypedDataParameters<typedData, primaryType, account> & WrapMessageHashParams): Promise<SignTypedDataReturnType>;
//# sourceMappingURL=signTypedData.d.ts.map