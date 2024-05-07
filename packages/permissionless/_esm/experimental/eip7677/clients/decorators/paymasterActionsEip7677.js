import { getPaymasterData } from "../../actions/getPaymasterData.js";
import { getPaymasterStubData } from "../../actions/getPaymasterStubData.js";
const paymasterActionsEip7677 = ({ entryPoint }) => (client) => ({
    getPaymasterData: (args) => getPaymasterData(client, {
        userOperation: args.userOperation,
        context: args.context,
        chain: args.chain,
        entryPoint
    }),
    getPaymasterStubData: async (args) => getPaymasterStubData(client, {
        userOperation: args.userOperation,
        context: args.context,
        chain: args.chain,
        entryPoint
    })
});
export { paymasterActionsEip7677 };
//# sourceMappingURL=paymasterActionsEip7677.js.map