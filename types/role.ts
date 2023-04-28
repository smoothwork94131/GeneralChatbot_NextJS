export interface RoleGroup {
    name: string;
    utilities_group: UtilitiesGroup[]
}
export interface UtilitiesGroup {
    name: string;
    utilities: Utility[];
}
export interface Utility {
    id?: number;
    name: string;
    inputs: Input[];
    summary: string,
    prompt_message?: string[];
}
export interface Input {
    name: string;
    id?: number;
    type: string;
    options?: string[];
    max_len?: number;
}
