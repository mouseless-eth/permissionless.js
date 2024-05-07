"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymasterActionsEip7677 = void 0;
const getPaymasterData_1 = require("../../actions/getPaymasterData.js");
const getPaymasterStubData_1 = require("../../actions/getPaymasterStubData.js");
const paymasterActionsEip7677 = ({ entryPoint }) => (client) => ({
    getPaymasterData: (args) => (0, getPaymasterData_1.getPaymasterData)(client, {
        userOperation: args.userOperation,
        context: args.context,
        chain: args.chain,
        entryPoint
    }),
    getPaymasterStubData: async (args) => (0, getPaymasterStubData_1.getPaymasterStubData)(client, {
        userOperation: args.userOperation,
        context: args.context,
        chain: args.chain,
        entryPoint
    })
});
exports.paymasterActionsEip7677 = paymasterActionsEip7677;
//# sourceMappingURL=paymasterActionsEip7677.js.map