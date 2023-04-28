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
                        inputs:[
                            {
                                name: "Language From",
                                type: "dropdown",
                                options: [
                                    "English",
                                    "Spanish"
                                ]
                            },
                            {
                                name: "icon",
                                type: "icon",
                                options: [
                                ]
                            },
                            {
                                name: "Language From",
                                type: "dropdown",
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
                        inputs:[
                        ]
                    },
                    {
                        name: "Css",
                        summary: '',
                        inputs:[
                        ]
                    },
                    {
                        name: "Database",
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
                        inputs:[
                        ]
                    },
                    {
                        name: "Interface",
                        summary: '',
                        inputs:[
                        ]
                    },
                    {
                        name: "Android",
                        summary: '',
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
                        summary: '',
                        inputs:[
                        ]
                    },
                    {
                        name: "Influenty",
                        summary: '',
                        inputs:[
                        ]
                    },
                    {
                        name: "Native",
                        summary: '',
                        inputs:[
                        ]
                    }
                ]
            }
        ]
    },
];

export const Languages = [
    "English",
    "Spanish"
]