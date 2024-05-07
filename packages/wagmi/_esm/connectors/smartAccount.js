import { chainId } from "permissionless";
import {} from "permissionless/accounts";
import { createConnector } from "wagmi";
export function smartAccount({ smartAccountClient, id = smartAccountClient.uid, name = smartAccountClient.name, type = "smart-account" }) {
    // Don't remove this, it is needed because wagmi has an opinion on always estimating gas:
    // https://github.com/wevm/wagmi/blob/main/packages/core/src/actions/sendTransaction.ts#L77
    smartAccountClient.estimateGas = () => {
        return undefined;
    };
    return createConnector((config) => ({
        id,
        name,
        type,
        // async setup() {},
        async connect({ chainId } = {}) {
            if (chainId && chainId !== (await this.getChainId())) {
                throw new Error(`Invalid chainId ${chainId} requested`);
            }
            return {
                accounts: [smartAccountClient.account.address],
                chainId: await this.getChainId()
            };
        },
        async disconnect() { },
        async getAccounts() {
            return [smartAccountClient.account.address];
        },
        getChainId() {
            return chainId(smartAccountClient);
        },
        async getProvider() { },
        async isAuthorized() {
            return !!smartAccountClient.account.address;
        },
        onAccountsChanged() {
            // Not relevant
        },
        onChainChanged() {
            // Not relevant because smart accounts only exist on single chain.
        },
        onDisconnect() {
            config.emitter.emit("disconnect");
        },
        async getClient({ chainId: requestedChainId }) {
            const chainId = await this.getChainId();
            if (requestedChainId !== chainId) {
                throw new Error(`Invalid chainId ${chainId} requested`);
            }
            return smartAccountClient;
        }
    }));
}
//# sourceMappingURL=smartAccount.js.map