export type EntryPointVersion = "v0.6" | "v0.7"

export type ENTRYPOINT_ADDRESS_V06_TYPE =
    "0x94BFb82d788b874F35b823390eAECaafEf855Fdb"
export type ENTRYPOINT_ADDRESS_V07_TYPE =
    "0x6FD13B10bBb052879b06D320cEce3b06566C58F0"

export type GetEntryPointVersion<entryPoint extends EntryPoint> =
    entryPoint extends ENTRYPOINT_ADDRESS_V06_TYPE ? "v0.6" : "v0.7"

export type EntryPoint =
    | ENTRYPOINT_ADDRESS_V06_TYPE
    | ENTRYPOINT_ADDRESS_V07_TYPE
