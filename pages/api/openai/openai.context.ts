import { Dispatch, createContext } from 'react';
import { ActionType } from '@/hooks/useCreateReducer';
import { OpenaiInitialState } from './openai.state';

export interface OpenaiContextProps {
    state: OpenaiInitialState;
    dispatch: Dispatch<ActionType<OpenaiInitialState>>;
    handleSelectRole: (index: number) => void;
    handleSelectUtility: (group_index: number, utility_index: number) => void;
}

const OpenaiContext = createContext<OpenaiContextProps>(undefined!);
export default OpenaiContext;