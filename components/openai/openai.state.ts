import { Conversation } from "@/types/chat";
import { RoleGroup, UtilitiesGroup, Utility, PrompState, SelectedSearch, SelectedSearchState, UtilityState, RoleGroupState } from "@/types/role";
import { ROLE_GROUP } from "@/utils/app/const";

export interface OpenaiInitialState {
    apiKey: string;
    loading: boolean;
    messageIsStreaming: boolean;
    messageError: boolean;
    searchTerm: string; 
    conversationHistory: Conversation[];
    selectedRole: RoleGroup;
    selectedUtility: Utility;
    roleGroup: RoleGroup[]
    selectedUtilityGroup: UtilitiesGroup[]; 
    selectedConversation: Conversation;
    selectedSearch: SelectedSearch;
}
export const initialState: OpenaiInitialState = {
    apiKey: '',
    loading: false,
    messageIsStreaming: false,
    messageError: false,
    searchTerm: '',
    conversationHistory: [],
    selectedRole: RoleGroupState,
    // selectedUtility: ROLE_GROUP[0].utilities_group[0].utilities[0],
    selectedUtility: UtilityState,
    roleGroup: ROLE_GROUP,
    // selectedUtilityGroup: ROLE_GROUP[0].utilities_group,
    selectedUtilityGroup:[],
    selectedConversation: PrompState,
    selectedSearch: SelectedSearchState,
};
  