"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserOperationVersion07 = exports.isUserOperationVersion06 = exports.getEntryPointVersion = exports.ENTRYPOINT_ADDRESS_V07 = exports.ENTRYPOINT_ADDRESS_V06 = void 0;
exports.ENTRYPOINT_ADDRESS_V06 = "0x94BFb82d788b874F35b823390eAECaafEf855Fdb";
exports.ENTRYPOINT_ADDRESS_V07 = "0x6FD13B10bBb052879b06D320cEce3b06566C58F0";
const getEntryPointVersion = (entryPoint) => entryPoint === exports.ENTRYPOINT_ADDRESS_V06 ? "v0.6" : "v0.7";
exports.getEntryPointVersion = getEntryPointVersion;
function isUserOperationVersion06(entryPoint, _operation) {
    return (0, exports.getEntryPointVersion)(entryPoint) === "v0.6";
}
exports.isUserOperationVersion06 = isUserOperationVersion06;
function isUserOperationVersion07(entryPoint, _operation) {
    return (0, exports.getEntryPointVersion)(entryPoint) === "v0.7";
}
exports.isUserOperationVersion07 = isUserOperationVersion07;
//# sourceMappingURL=getEntryPointVersion.js.map