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
                active: true,
                utilities: [
                    {
                        name: "Translate",
                        summary: 'Enter text for translation',
                        type: 'translate',
                        style:'',
                        active: true,
                        input_align: 'horizental',
                        prompt_message:'Translate the following text from {0} to {1} TEXT TO TRANSLATE {2}',
                        inputs:[
                            {
                                name: "Language From",
                                type: "form",
                                value: 'English',
                                component: "Select",
                                style:'',
                                options: [
                                    "English",
                                    "Spanish"
                                ]
                            },
                            {
                                name: "convert icon",
                                type: "icon",
                                component: "IconArrowRight",
                                style:'text-gray-400 w-[30px]',
                            },
                            {
                                name: "Language From",
                                component: "Select",
                                type: 'form',
                                value: "Spanish",
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
                active: true,
                utilities: [
                    {
                        name: "Javascript",
                        summary: '',
                        style:'',
                        input_align: 'horizental',
                        active: true,
                        prompt_message:'',
                        inputs:[
                        ]
                    },
                    {
                        name: "Css",
                        style:'',
                        summary: '',
                        input_align: 'horizental',
                        prompt_message:'',
                        active: false,
                        inputs:[
                        ]
                    },
                    {
                        name: "Database",
                        style:'',
                        input_align: 'horizental',
                        active: false,
                        prompt_message:'',
                        summary: '',
                        inputs:[
                        ]
                    }
                ]
            },
            {
                name: "Java",
                active: false,
                utilities: [
                    {
                        name: "Spring boot",
                        summary: '',
                        style:'',
                        active: false,
                        input_align: 'horizental',
                        prompt_message:'',
                        type:'',
                        inputs:[
                        ]
                    },
                    {
                        name: "Interface",
                        summary: '',
                        type:'',
                        style:'',
                        input_align: 'horizental',
                        active: false,
                        inputs:[
                        ]
                    },
                    {
                        name: "Android",
                        summary: '',
                        type:'',
                        input_align: 'horizental',
                        style:'',
                        prompt_message:'',
                        active: false,
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
                active: true,
                utilities: [
                    {
                        name: "Base",
                        style:'',
                        type:'',
                        active: true,
                        input_align: 'horizental',
                        prompt_message:'',
                        summary: '',
                        inputs:[
                        ]
                    },
                    {
                        name: "Influenty",
                        style:'',
                        type:'',
                        active: false,
                        input_align: 'horizental',
                        prompt_message:'',
                        summary: '',
                        inputs:[
                        ]
                    },
                    {
                        name: "Native",
                        summary: '',
                        active: false,
                        type:'',
                        input_align: 'horizental',
                        prompt_message:'',
                        style:'',
                        inputs:[
                        ]
                    }
                ]
            }
        ]
    },
];

