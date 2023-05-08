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
    prompt?: Prompt;
}
export interface Input {
    name: string;
    id?: number;
    type: string;
    value?: string;
    style: string;
    size?: string | number;
    options?: string[];
    component: string;
    max_len?: number;
}
export interface Prompt {
    description?: string ;
    systemMessage: string;
    userMessage: string;
    symbol?: string;
    examples?: string[];
    datetime?: string;
}

export const PrompState = {key:'', name:'', messages:[], datetime: new Date().toISOString().split('T')[0]}

  
