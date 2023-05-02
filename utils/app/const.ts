import { IconArrowRight } from "@tabler/icons-react";
import { Select } from "@mantine/core";

export const Languages = [
    "English",
    "Spanish"
]
export const MOBILE_LIMIT_WIDTH = 760;
export const OPENAI_API_HOST =
  process.env.OPENAI_API_HOST || 'https://api.openai.com';
export const DEFAULT_TEMPERATURE = 
  parseFloat(process.env.NEXT_PUBLIC_DEFAULT_TEMPERATURE || "1");

export const OPENAI_API_TYPE =
  process.env.OPENAI_API_TYPE || 'openai';

export const OPENAI_API_VERSION =
  process.env.OPENAI_API_VERSION || '2023-03-15-preview';

export const OPENAI_ORGANIZATION =
  process.env.OPENAI_ORGANIZATION || '';

export const AZURE_DEPLOYMENT_ID =
  process.env.AZURE_DEPLOYMENT_ID || '';
export const DEFAULT_SYSTEM_PROMPT =
  process.env.NEXT_PUBLIC_DEFAULT_SYSTEM_PROMPT ||
  "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown.";

export const ROLE_GROUP = [
    {
        name: 'Marketing',
        utilities_group:[
            {
                name: "Copywriting",
                utilities: [
                    {
                        name: "Translate",
                        summary: 'Enter text for translation',
                        type: 'translate',
                        style:'',
                        inputs:[
                            {
                                name: "Language From",
                                type: "Select",
                                value: 'English',
                                component: Select,
                                style:'',
                                options: [
                                    "English",
                                    "Spanish"
                                ]
                            },
                            {
                                name: "convert icon",
                                type: "IconArrowLeft",
                                style:'text-gray-400 w-[30px]',
                                component: IconArrowRight,
                            },
                            {
                                name: "Language From",
                                type: "Select",
                                value: "Spanish",
                                component: Select,
                                style:'',
                                options: [
                                    "Spanish",
                                    "English",
                                ]
                            },
                        ]
                    }
                ]
            }       
        ]
    },
    {
        name: "Coding",
        utilities_group:[
            {
                name: "Web",
                utilities: [
                    {
                        name: "Javascript",
                        summary: '',
                        style:'',
                        inputs:[
                        ]
                    },
                    {
                        name: "Css",
                        style:'',
                        summary: '',
                        inputs:[
                        ]
                    },
                    {
                        name: "Database",
                        style:'',
                        summary: '',
                        inputs:[
                        ]
                    }
                ]
            },
            {
                name: "Java",
                utilities: [
                    {
                        name: "Spring boot",
                        summary: '',
                        style:'',
                        type:'',
                        inputs:[
                        ]
                    },
                    {
                        name: "Interface",
                        summary: '',
                        type:'',
                        style:'',
                        inputs:[
                        ]
                    },
                    {
                        name: "Android",
                        summary: '',
                        type:'',
                        style:'',
                        inputs:[
                        ]
                    }
                ]
            } 
        ]
    },
    {
        name: "Learning",
        utilities_group:[
            {
                name: "English",
                utilities: [
                    {
                        name: "Base",
                        style:'',
                        type:'',
                        summary: '',
                        inputs:[
                        ]
                    },
                    {
                        name: "Influenty",
                        style:'',
                        type:'',
                        summary: '',
                        inputs:[
                        ]
                    },
                    {
                        name: "Native",
                        summary: '',
                        type:'',
                        style:'',
                        inputs:[
                        ]
                    }
                ]
            }
        ]
    },
];

