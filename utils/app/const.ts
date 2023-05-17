export const Languages = [
    "English",
    "Spanish"
]
export const MOBILE_LIMIT_WIDTH = 760;
export const SPREAD_SHEET_ID = '1gZE3k2_JWsZL0g9Y88qT_SmVtleZosLpD_T8PNjerK4';
export const SHEET_RANGE = 'Sheet1';
export const GOOGLE_SHEETS_CLIENT_EMAIL = 'sheet-api-service-account@igfitchatbot.iam.gserviceaccount.com';
export const GOOGLE_SHEETS_PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC9LgBbdEb0xt9O\n47rlxbKf+w4dF6zJhR7u3zraMlAylaLkSWOIYlqmZ9L/31ev8jVvnNINfJQlrzkM\nhavyFxgniqUJa3gMTArWNbP3bkjZ+N4AW3qkpLMeAFQyuPiS8RIyj0+DDssOS+QM\n7LObkUGmxQsZQBJANcTd7pPJAKeNTlAO+1APhh71Ov4wjgFidU+LonnMyAkSW8J+\n6bYvjDx56kr4XFfybrw6U5Vo9Jb5ChZncL0Wid/FMV6GJqN47MTHEAPPlHXJIX5d\ndxhY1tUTVwWydJvcg8LvuMtrwEGDzYAcZlf1q8utSbFvbxKe2YlCU0ioG8Krad0l\nPNMyCDqDAgMBAAECggEAXo4iDpP5LTpDfiZUEal1RQISRVdCfT0Ev4ci3tF8BTSG\nhMzrq0zhmz/UliCXLvGEZOOAl84XLBi/DnO3hBqn74ecQq+NArR1TCjuaTMdxZje\nuVX/4FAT2OB4NRv/3k4Q9uVrbAmWU3B6LT2X7h81rbnZ+MZt+NsHKZgoFLS3imfm\nWYq+BM4eVMMIuNjPHm8HHQxKuLKb27E+P6YM7yC1TowifMh7uAzwBLZPKUWURmza\nw3CG/OEJUY5cNvRU4g1mqEwBZ8QrngStF/f0uIyZ1lo/bbbzwBk5M0K0oF4iWhTf\nXubDlqjRL7t5x2uWMLfPjWHZ8kU4Ro3aX/e9cNKoWQKBgQD9/g8Dd+/26IDcx5we\nsQ7ISAhZNInxxEr6KeMGaZsjBotdLPFepxtkylf8mHT4pmemerEqeJLtYy433r/m\nYkUgFJdvyHkxwGV7V4UJqsZYP/gsosPfdSfWgg1XDTcklkpRROu1pZzHIO/U9/0J\nnU8lVLHcn3XedIPXtW28Gee7+QKBgQC+rMwelFuXg/sdR8/YtAR4XByExUN5rU0i\n32CErbajVD8/4PT3sB0VbMCmxZcoWAapjVZrUJ7zFOPdTS6KXVRszQ2kA//VzXQZ\nVqk1wZCYj/Se9IuJIaa2jNxx/y0GNwpXFIvZ4TQ/M4WOXqMTMNijavLfscvBhjvk\nSzCSCQvxWwKBgQD1ZnprB366OHoI1nNo0/lMWQx34+NDzDwE6GOI1pAljzUnmTy8\nDwjQoQ/R5hteAqkymGiEeGq9IY6OPJF8roXLMRn/ztoJz7I9MZpAdNeefG/z8G7/\nf9o1zwHEkegtWWgEjWqP3qtTWedfBRteJrdJgkM2vnrLrBeWWpzjmMPlQQKBgD3s\nmI4F2Ikoj9E+lT3nmNwN7iUge310zuxYZ1wvnnUE01XHlUcrpwZiP17qJOExVViT\nUlGf6T9AtZAVlNvS26xKG/f8ZIXnJ6FjB6kxp+gkOGm3OenbR+1Zae6L1O+DyJPn\nVFP6U6GC9gj6qzN8VZ8dCKulbmr3UVQfJzMGRR6pAoGANNfkFcXXPWg5X1r4S8Er\n8vs7N+blpeDanuMFOv23Ceac6FZHx0DSr+WyMzjVAwCKwwAN36EtOsd5SXofk7dB\nDK6S8NbxvLkRR/kOOyU3D/JEWqWTCOBd04cBOBEpuficUWGeH0Um1CJYDrx4lBOu\n644y+AQzTRmq6NJFcearR3c=\n-----END PRIVATE KEY-----\n';
export const OPENAI_API_HOST =
  process.env.OPENAI_API_HOST || 'https://api.openai.com';

export const DEFAULT_TEMPERATURE = 
  parseFloat(process.env.NEXT_PUBLIC_DEFAULT_TEMPERATURE || "1");

export const OPENAI_API_TYPE =
  process.env.OPENAI_API_TYPE || 'openai';

export const OPENAI_API_KEY =
  process.env.OPENAI_API_KEY || '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';

export const OPENAI_API_VERSION =
  process.env.OPENAI_API_VERSION || '2023-03-15-preview';

export const OPENAI_API_MAXTOKEN = 500;

export const OPENAI_ORGANIZATION =
  process.env.OPENAI_ORGANIZATION || '';

export const OPENAI_MODELID =
  process.env.OPENAI_MODELID || 'gpt-3.5-turbo';

export const GOOGLE_CLIENT_EMAIL =
  process.env.GOOGLE_CLIENT_EMAIL || '';

export const GOOGLE_PRIVATE_KEY =
  process.env.GOOGLE_PRIVATE_KEY || '';

export const AZURE_DEPLOYMENT_ID =
  process.env.AZURE_DEPLOYMENT_ID || '';

export const DEFAULT_SYSTEM_PROMPT =
  process.env.NEXT_PUBLIC_DEFAULT_SYSTEM_PROMPT ||
'You are ChatGPT, a large language model trained by OpenAI, based on the GPT-4 architecture.\nKnowledge cutoff: 2021-09\nCurrent date: {{Today}}';

export const ROLE_GROUP = [
    // {
    //     name: 'Marketing',
    //     utilities_group:[
    //         {
    //             name: "Copywriting",
    //             active: true,
    //             utilities: [
    //                 {
    //                     name: "Translate",
    //                     summary: 'Enter text for translation',
    //                     type: 'translate',
    //                     style:'',
    //                     active: true,
    //                     input_align: 'horizental',
    //                     system_prompt: 'You are a helpful assistant that translates',
    //                     user_prompt: 'Please translate the following text from {0} to {1} :{2}',
    //                     include_prompt_history: true,
    //                     key: 'Marketing_Copywriting_Translate',
    //                     inputs:[
    //                         {
    //                             name: "Language From",
    //                             type: "form",
    //                             value: 'English',
    //                             component: "Select",
    //                             style:'',
    //                             options: [
    //                                 "English",
    //                                 "Spanish"
    //                             ]
    //                         },
    //                         {
    //                             name: "convert icon",
    //                             type: "icon",
    //                             component: "IconArrowRight",
    //                             style:'text-gray-400 w-[30px]',
    //                         },
    //                         {
    //                             name: "Language From",
    //                             component: "Select",
    //                             type: 'form',
    //                             value: "Spanish",
    //                             style:'',
    //                             options: [
    //                                 "Spanish",
    //                                 "English",
    //                             ]
    //                         },
    //                     ]
    //                 }
    //             ]
    //         }
    //     ]
    // },
    // {
    //     name: "Coding",
    //     utilities_group:[
    //         {
    //             name: "Web",
    //             active: true,
    //             utilities: [
    //                 {
    //                     name: "Javascript",
    //                     summary: '',
    //                     style:'',
    //                     input_align: 'horizental',
    //                     active: true,
    //                     key: 'Coding_Web_Javascript',
    //                     include_prompt_history: false,
    //                     user_prompt: 'Write a JavaScript function that implements {0}',
    //                     inputs:[
    //                     ]
    //                 },
    //                 {
    //                     name: "Css",
    //                     style:'',
    //                     summary: '',
    //                     input_align: 'horizental',
    //                     active: false,
    //                     key:'Coding_Web_Css',
    //                     include_prompt_history: true,
    //                     inputs:[
    //                     ]
    //                 },
    //                 {
    //                     name: "Database",
    //                     style:'',
    //                     input_align: 'horizental',
    //                     active: false,
    //                     include_prompt_history: true,
    //                     key:'Coding_Web_Database',
    //                     summary: '',
    //                     inputs:[
    //                     ]
    //                 }
    //             ]
    //         },
    //         {
    //             name: "Java",
    //             active: false,
    //             utilities: [
    //                 {
    //                     name: "Spring boot",
    //                     summary: '',
    //                     style:'',
    //                     active: false,
    //                     input_align: 'horizental',
    //                     type:'',
    //                     include_prompt_history: true,
    //                     key: 'Coding_Java_Spring boot',
    //                     inputs:[
    //                     ]
    //                 },
    //                 {
    //                     name: "Interface",
    //                     summary: '',
    //                     type:'',
    //                     style:'',
    //                     input_align: 'horizental',
    //                     active: false,
    //                     include_prompt_history: true,
    //                     key: 'Coding_Java_Interface',
    //                     inputs:[
    //                     ]
    //                 },
    //                 {
    //                     name: "Android",
    //                     summary: '',
    //                     type:'',
    //                     input_align: 'horizental',
    //                     style:'',
    //                     key: 'Coding_Java_Android',
    //                     include_prompt_history: true,
    //                     active: false,
    //                     inputs:[
    //                     ]
    //                 }
    //             ]
    //         } 
    //     ]
    // },
    // {
    //     name: "Learning",
    //     utilities_group:[
    //         {
    //             name: "English",
    //             active: true,
    //             utilities: [
    //                 {
    //                     name: "Base",
    //                     style:'',
    //                     type:'',
    //                     active: true,
    //                     input_align: 'horizental',
    //                     summary: '',
    //                     include_prompt_history: true,
    //                     key: 'Learning_English_Base',
    //                     inputs:[
    //                     ]
    //                 },
    //                 {
    //                     name: "Influenty",
    //                     style:'',
    //                     type:'',
    //                     active: false,
    //                     input_align: 'horizental',
    //                     include_prompt_history: true,
    //                     key: 'Learning_English_Influenty',
    //                     summary: '',
    //                     inputs:[
    //                     ]
    //                 },
    //                 {
    //                     name: "Native",
    //                     summary: '',
    //                     active: false,
    //                     type:'',
    //                     input_align: 'horizental',
    //                     include_prompt_history: true,
    //                     key: 'Learning_English_Native',
    //                     style:'',
    //                     inputs:[
    //                     ]
    //                 }
    //             ]
    //         }
    //     ]
    // },
];

