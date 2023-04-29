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
    style: string | number;
    type?:string;
    prompt_message?: string[];
}
export interface Input {
    name: string;
    id?: number;
    type?: string;
    value?: string | number;
    component: any;
    style: string;
    size?: string | number;
    options?: string[];
    max_len?: number;
}
