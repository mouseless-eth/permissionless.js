export const ENTRYPOINT_ADDRESS_V06 = "0x94BFb82d788b874F35b823390eAECaafEf855Fdb";
export const ENTRYPOINT_ADDRESS_V07 = "0x6FD13B10bBb052879b06D320cEce3b06566C58F0";
export const getEntryPointVersion = (entryPoint) => entryPoint === ENTRYPOINT_ADDRESS_V06 ? "v0.6" : "v0.7";
export function isUserOperationVersion06(entryPoint, _operation) {
    return getEntryPointVersion(entryPoint) === "v0.6";
}
// Type predicate to check if the UserOperation is V07.
export function isUserOperationVersion07(entryPoint, _operation) {
    return getEntryPointVersion(entryPoint) === "v0.7";
}
//# sourceMappingURL=getEntryPointVersion.js.map