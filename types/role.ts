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
    summary: string;
    active: boolean;
    style: string | number;
    type?:string;
    
    input_align?: 'horizental',
    prompt_message?: string[];
}
export interface Input {
    name: string;
    id?: number;
    type?: string;
    value?: string | number;
    style: string;
    size?: string | number;
    options?: string[];
    component: string;
    max_len?: number;
}
