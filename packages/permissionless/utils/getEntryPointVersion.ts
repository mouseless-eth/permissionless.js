import type {
    ENTRYPOINT_ADDRESS_V06_TYPE,
    ENTRYPOINT_ADDRESS_V07_TYPE,
    UserOperation
} from "../types"
import type { EntryPoint, GetEntryPointVersion } from "../types/entrypoint"

export const ENTRYPOINT_ADDRESS_V06: ENTRYPOINT_ADDRESS_V06_TYPE =
    "0x94BFb82d788b874F35b823390eAECaafEf855Fdb"
export const ENTRYPOINT_ADDRESS_V07: ENTRYPOINT_ADDRESS_V07_TYPE =
    "0x6FD13B10bBb052879b06D320cEce3b06566C58F0"

export const getEntryPointVersion = (
    entryPoint: EntryPoint
): GetEntryPointVersion<EntryPoint> =>
    entryPoint === ENTRYPOINT_ADDRESS_V06 ? "v0.6" : "v0.7"

export function isUserOperationVersion06(
    entryPoint: EntryPoint,
    _operation: UserOperation<"v0.6"> | UserOperation<"v0.7">
): _operation is UserOperation<"v0.6"> {
    return getEntryPointVersion(entryPoint) === "v0.6"
}

// Type predicate to check if the UserOperation is V07.
export function isUserOperationVersion07(
    entryPoint: EntryPoint,
    _operation: UserOperation<"v0.6"> | UserOperation<"v0.7">
): _operation is UserOperation<"v0.7"> {
    return getEntryPointVersion(entryPoint) === "v0.7"
}
