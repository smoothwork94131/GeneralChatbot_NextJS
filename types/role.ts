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
    id?: number;
    name: string;
    inputs: Input[];
    summary: string;
    active: boolean;
    style: string | number;
    type?: string;
    input_align?: string,
    prompt_message?: string;
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
