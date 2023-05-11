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
    system_prompt?: string;
    user_prompt?: string;
}
export const  UtilityState:Utility = {
    key: '',
    name: '',
    inputs: [],
    active: false,
    style: '',
    summary:'',
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

export const PrompState = {key:'', name:'', messages:[], datetime: new Date().toISOString().split('T')[0]}

  
