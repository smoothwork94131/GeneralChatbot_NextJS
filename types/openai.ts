import { OPENAI_API_TYPE } from '../utils/app/const';

export interface OpenAIModel {
  id: string;
  name: string;
  maxLength: number; // maximum length of a message
  tokenLimit: number;
}

export enum OpenAIModelID {
  GPT_3_5 = 'gpt-3.5-turbo',
  GPT_3_5_AZ = 'gpt-35-turbo',
  GPT_4 = 'gpt-4',
  GPT_4_32K = 'gpt-4-32k',
}

// in case the `DEFAULT_MODEL` environment variable is not set or set to an unsupported model
export const fallbackModelID = OpenAIModelID.GPT_3_5;
export const OpenAIModels: Record<OpenAIModelID, OpenAIModel> = {
  [OpenAIModelID.GPT_3_5]: {
    id: OpenAIModelID.GPT_3_5,
    name: 'GPT-3.5',
    maxLength: 12000,
    tokenLimit: 4000,
  },
  [OpenAIModelID.GPT_3_5_AZ]: {
    id: OpenAIModelID.GPT_3_5_AZ,
    name: 'GPT-3.5',
    maxLength: 12000,
    tokenLimit: 4000,
  },
  [OpenAIModelID.GPT_4]: {
  id: OpenAIModelID.GPT_4,
    name: 'GPT-4',
    maxLength: 24000,
    tokenLimit: 8000,
  },
  [OpenAIModelID.GPT_4_32K]: {
    id: OpenAIModelID.GPT_4_32K,
    name: 'GPT-4-32K',
    maxLength: 96000,
    tokenLimit: 32000,
  },
};

export type ChatGPTAgent = "user" | "system";
  
export interface ChatGPTMessage {
  role: ChatGPTAgent;
  content: string;
}

export interface OpenAIStreamPayload {
  model: string;
  messages: ChatGPTMessage[];
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  max_tokens: number;
  stream: boolean;
  n: number;
}
export namespace OpenAIAPI {
  // not an OpenAI type, but the endpoint configuration to access the API
  export interface Configuration {
    apiKey?: string;
    apiHost?: string;
    apiOrganizationId?: string;
  }
  // [API] Chat
  export namespace Chat {
    export interface Message {
      role: 'assistant' | 'system' | 'user';
      content: string;
    }
    export interface CompletionsRequest {
      model: string;
      messages: Message[];
      temperature?: number;
      top_p?: number;
      frequency_penalty?: number;
      presence_penalty?: number;
      max_tokens?: number;
      stream: boolean;
      n: number;
    }

    export interface CompletionsResponse {
      id: string;
      object: 'chat.completion';
      created: number; // unix timestamp in seconds
      model: string; // can differ from the ask, e.g. 'gpt-4-0314'
      choices: {
        index: number;
        message: Message;
        finish_reason: 'stop' | 'length' | null;
      }[];
      usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
      };
    }

    export interface CompletionsResponseChunked {
      id: string;
      object: 'chat.completion.chunk';
      created: number;
      model: string;
      choices: {
        index: number;
        delta: Partial<Message>;
        finish_reason: 'stop' | 'length' | null;
      }[];
    }
  }

  // [API] Models
  export namespace Models {
    interface Model {
      id: string;
      object: 'model';
      created: number;
      owned_by: 'openai' | 'openai-dev' | 'openai-internal' | 'system' | string;
      permission: any[];
      root: string;
      parent: null;
    }

    export interface ModelList {
      object: string;
      data: Model[];
    }
  }
}