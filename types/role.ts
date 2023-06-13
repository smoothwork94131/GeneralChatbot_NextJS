export interface RoleGroup {
    name: string;
    utilities_group: UtilitiesGroup[]
}
export const RoleGroupState = {
    name: '',
    utilities_group:[]
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
    style?: string | number;
    type?: string;
    input_align?: string,
    system_prompt?: string;
    user_prompt?: string;
    include_prompt_history: boolean;
    streaming?: boolean;
    buttonGroup: ButtonGroup[];
    settings: Setting[]
}
export interface Setting {
    name: string,
    items: SettingItem[],
}
export interface SettingItem {
    name:string,
    prompt: string,
    active:boolean
}
export interface Buttons {
    name: string,
    user_prompt: string,
    system_prompt: string,
}
export interface ButtonGroup {
    name: string,
    buttons: Buttons[]
}
export interface ButtonPrompts {
    group_name: string,
    button_name: string;
    
}
export const  UtilityState:Utility = {
    key: '',
    name: '',
    inputs: [],
    active: false,
    style: '',
    summary:'',
    include_prompt_history: true,
    buttonGroup:[],
    settings:[]
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
export interface SelectedSearch {
    utility_key:string,
    history_index: number,
}
export const SelectedSearchState = {
    utility_key: '',
    history_index: -1
}

export const PrompState = {key:'', name:'', messages:[], datetime: new Date().toISOString().split('T')[0]}

  
