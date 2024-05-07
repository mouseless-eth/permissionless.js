import { type Chain, type Client, type Hex, type Transport } from "viem";
import type { ENTRYPOINT_ADDRESS_V06_TYPE, Prettify } from "../../types";
import { type BiconomySmartAccount, type SignerToBiconomySmartAccountParameters } from "./signerToBiconomySmartAccount";
export type PrivateKeyToBiconomySmartAccountParameters<entryPoint extends ENTRYPOINT_ADDRESS_V06_TYPE> = Prettify<{
    privateKey: Hex;
} & Omit<SignerToBiconomySmartAccountParameters<entryPoint>, "signer">>;
/**
 * @description Creates a Biconomy Smart Account from a private key.
 *
 * @returns A Private Key Biconomy Smart Account using ECDSA as default validation module.
 */
export declare function privateKeyToBiconomySmartAccount<entryPoint extends ENTRYPOINT_ADDRESS_V06_TYPE, TTransport extends Transport = Transport, TChain extends Chain | undefined = Chain | undefined>(client: Client<TTransport, TChain, undefined>, { privateKey, ...rest }: PrivateKeyToBiconomySmartAccountParameters<entryPoint>): Promise<BiconomySmartAccount<entryPoint, TTransport, TChain>>;
//# sourceMappingURL=privateKeyToBiconomySmartAccount.d.ts.map