export interface RoleGroup {
    name: string;
    utilities_group: UtilitiesGroup[]
}
export interface UtilitiesGroup {
    name: string;
    active: boolean;
    utilities: Utility[];
}
export interface Utility {
    key: string;
    name: string;
    inputs: Input[];
    summary: string;
    active: boolean;
    style: string | number;
    type?: string;
    input_align?: string,
    prompt?: string;
}
export interface Input {
    name: string;
    id?: number;
    type: "form" | "icon";
    value?: string;
    style: string;
    size?: string | number;
    options?: string[];
    component: string;
    max_len?: number;
}
