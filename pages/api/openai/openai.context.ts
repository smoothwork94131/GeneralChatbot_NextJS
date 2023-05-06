import { Dispatch, createContext } from 'react';
import { ActionType } from '@/hooks/useCreateReducer';
import { OpenaiInitialState } from './openai.state';

export interface OpenaiContextProps {
    state: OpenaiInitialState;
    dispatch: Dispatch<ActionType<OpenaiInitialState>>;
    handleSelectRole: (index: number) => void;
    handleSelectUtility: (utility_key: string) => void;
}

const OpenaiContext = createContext<OpenaiContextProps>(undefined!);
export default OpenaiContext;