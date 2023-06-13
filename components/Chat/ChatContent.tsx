import { 
    FC, 
    useState,
    useRef } from 'react';
import { 
    Flex, 
    Space, 
    Text,
    Box,
    Group,
    Button,
    Modal,
    Radio,
} from '@mantine/core';
import ChatInput from './ChatInput';
import { ButtonPrompts, Input, RoleGroup, SelectedSearch, Setting, Utility } from '@/types/role';
import ChatMessage from '@/components/Chat/ChatMessage';
import { AssistantMessageState, Conversation, Message,  SettingPromptItem,  UserMessageState } from '@/types/chat';
import { useEffect } from 'react';
import { getUserTimes } from '@/utils/app/supabase-client';
import { useUser } from '@supabase/auth-helpers-react';
import { AuthenticationForm } from '@/components/Account/AuthenticationForm';
import Subscription from '@/components/Account/Subscription';
import MyModal from '@/components/Account/Modal';
import { getFingerId } from '@/utils/app/FingerPrint';
import { OPENAI_MODELID } from '@/utils/app/const';
import { IconMistOff } from '@tabler/icons-react';
import ButtonGroup from '@/components/Chat/ButtonGroup';
import Output from '@/components/Chat/Output';

interface Props {
    selectedUtility: Utility;
    handleChangeUtilityInputsValue: (input_index: number, value: string)=>void,
    selectedConversation: Conversation,
    saveSelectConverSation: (conversation: Conversation)=>void;
    isMobile: boolean;
    conversationHistory: Conversation[],
    selectedSearch: SelectedSearch,
    clearSelectedSearch: () =>void;
    deleteConversation: (index: number)=>void;
    messageIsStreaming: boolean;
    setMessageIsStreaming: (type: boolean)=>void;
    handleSelectSettings: (setting_index: number, item_index: number)=>void;
    setUpdateUtilty: (utility: Utility) =>void;
    selectedRole: RoleGroup
} 

const ChatContent: FC<Props> = ({
        selectedUtility, 
        handleChangeUtilityInputsValue, 
        selectedConversation,
        saveSelectConverSation,
        isMobile,
        conversationHistory,
        selectedSearch,
        clearSelectedSearch,
        deleteConversation,
        messageIsStreaming,
        setMessageIsStreaming,
        handleSelectSettings,
        setUpdateUtilty,
        selectedRole
    }) =>{
    
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [inputContent,  setInputContent] = useState<string>('');
    const [historyConversation, setHistoryConversation] = useState<Conversation>();
    const [isModal, setIsModal] = useState<boolean>(false);
    const [isLimitModal, setIsLimitModal] = useState<boolean>(false);
    const [settingModal, setSettingModal] = useState(false);
    const [modalType, setModalType] = useState<string>('signin');
    const [isSubscription , setSubscription ] = useState<boolean>(false);
    const [settingTitle, setSettingTitle] = useState<string>('');
    const [settingName, setSettingName] = useState<string>('');
    const [buttonPromts, setButtonPrompts] = useState<ButtonPrompts>();
    const [inputError, setInputError] = useState<string>('');   
    const [responseText, setResponseText] = useState<string>('');
    const [isRegenerate, setIsRegenerate] = useState<boolean>(false);

    const user = useUser();
    
    
    useEffect(() => {
        const fetchData = async() => {
            // const data = await chkIsSubscription(user);
            // setSubscription(data);
        }
        fetchData();
        if(modalType == "signup" && user) {
            setModalType('subscription');
            setIsModal(true);
        }
    },[user]);

    useEffect(() => {
        setInputContent("");
    }, [selectedConversation])
    
    useEffect(()=> {
        setResponseText("");
    }, [selectedUtility])

    useEffect(() => {
        const history = localStorage.getItem("selectedConversation");
        if(history) {
            setHistoryConversation(JSON.parse(history));
        }
    }, [selectedConversation, selectedUtility, conversationHistory]);
    useEffect(() => {    
        if(messageIsStreaming) {
            setMessageIsStreaming(false);
        }
        setInputError("");
        if(isRegenerate) {
            handleSend();
            setIsRegenerate(false);
        }
    }, [selectedUtility])

    
    const handleSend = async () => {

        if(inputContent == "") {
            setInputError("Please enter a message.");
            return;
        }
        if(messageIsStreaming) {
            return;
        }
        

        setInputError("");
        setResponseText("");

        const message = inputContent;
        const fingerId = await getFingerId();
        const userTimes = await getUserTimes(user);
        
        
        if(userTimes <= 0 ) {
            setIsLimitModal(true);
            return;
        }

        if(selectedConversation) {

            let updatedConversation:Conversation = JSON.parse(JSON.stringify(selectedConversation));    
            const inputs = JSON.parse(JSON.stringify(selectedUtility.inputs));
            const today_datetime = new Date().toUTCString();
            let messages: Message[] = [];
            
            let settings: SettingPromptItem[] = [];
            
            selectedUtility.settings?.map((setting, setting_index) => {
                const activeSetting = setting.items.map((item, item_index) => {
                    if(item.active) {
                        settings.push({
                            setting_name: setting.name,
                            item_name: item.name
                        })
                    }
                })
            })
            
            
            let selectedMessagesHistory:Message[][] = []; selectedMessagesHistory = 
            [...selectedMessagesHistory, 
            ...updatedConversation.messages];
            
            if(selectedUtility.include_prompt_history){
                selectedMessagesHistory.map((messages_item, message_index) => {
                    messages_item.map((message) => {
                        messages = [...messages, message];
                    })
                });    
            }
            
            setMessageIsStreaming(true);

            const response_messages: Message[] = [];
            
            messages.map((item) => {
                response_messages.push({
                    role:item.role,
                    content: item.content,
                    inputs: item.inputs
                });
            });
            
            response_messages.push({
                role: 'user',
                content: message,
                inputs: inputs
            });

            const input: {
                response_messages: Message[],
                utilityKey: string,
                fingerId: string,
                settings: SettingPromptItem[]
                userId: string|null,
                buttonPrompts: ButtonPrompts|null|undefined
            } = { 
                response_messages: response_messages.map((item, index) => {
                    if(item.datetime) delete item?.datetime;
                    return item;
                }),
                utilityKey: selectedUtility.key,
                fingerId: fingerId,
                userId: user?user.id:null,
                settings:settings,
                buttonPrompts: buttonPromts
            };
            
            const user_message: Message = {    
                role: 'user',
                content: message,
                inputs: inputs,
                datetime: today_datetime,
                active: false,
                setting_prompt: settings,
                button_prompt: buttonPromts
            };

            updatedConversation.messages.push([user_message, AssistantMessageState]);
            saveSelectConverSation(updatedConversation);

            const controller = new AbortController();
            const signal = controller.signal;
            let endpoint = 'chat';
            if(selectedUtility.streaming) {
                endpoint = 'stream-chat';
            }

            const response = await fetch('/api/openai/'+endpoint, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(input),
                signal
            });
            
            if (!response.ok) {
                if(response.status == 401) {
                    setModalType('auth');      
                    setIsModal(true); 
                    setMessageIsStreaming(false);
                    return;
                } else if(response.status == 402) {
                    setModalType('Subscription');
                    setIsModal(true); 
                    setMessageIsStreaming(false);
                    return;
                } else if(response.status ==  429) {
                    alert("Too many requests");
                    setMessageIsStreaming(false);
                    return;
                }
                console.error('Error from API call: ', response.status, response.statusText);
                return '';
            }
            
            if(selectedUtility.streaming) {
                let first = true;
                if(response.body) {
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder("utf-8");
                    let text = "";
                    let done = false;
                    
                    while (!done) {
                        if(first) {
                            first = false;
                            continue;
                        }

                        const { value, done: doneReading } = await reader.read();
                        done = doneReading;
                        const chunkValue = decoder.decode(value);
                        
                        if (chunkValue) {
                        text += chunkValue.replace(JSON.stringify({"model":OPENAI_MODELID}), "");
                        setResponseText(text);
                        const assistant_message: Message = {role: 'assistant', content: text};
                        const updatedMessages: Message[][] =
                            updatedConversation.messages.map((message, index) => {    
                                if (index === updatedConversation.messages.length-1) {
                                    message = message.map((role_message) => {
                                        if(role_message.role == "assistant") {
                                            role_message = assistant_message;
                                            role_message = {
                                                ...role_message,
                                                datetime: today_datetime,
                                            }
                                        }
                                        return role_message;
                                    });
                                }
                                return message;
                            });
                            updatedConversation = { 
                                ...updatedConversation,
                                messages: updatedMessages,
                                datetime: today_datetime
                            };

                            saveSelectConverSation(updatedConversation);
                        }
                        
                    }
                }
            } else {
                const data = await response.json();
                const assistant_message: Message = data.message;
                
                const updatedMessages: Message[][] =
                updatedConversation.messages.map((message, index) => {    
                    if (index === updatedConversation.messages.length-1) {
                        message = message.map((role_message) => {
                            if(role_message.role == "assistant") {
                                role_message = assistant_message;
                                role_message = {
                                    ...role_message,
                                    datetime: today_datetime,
                                }
                            }
                            return role_message;
                        });
                    }
                    return message;
                });
                setResponseText(assistant_message.content);
                updatedConversation = { 
                    ...updatedConversation,
                    messages: updatedMessages,
                    datetime: today_datetime
                };

                saveSelectConverSation(updatedConversation);
            }
            setMessageIsStreaming(false);
        }
        
    }
    
    const componentUtilityInputs = () => {
        if(selectedUtility.inputs.length > 0) {
            return selectedUtility.inputs.map((input: Input, input_key: number) =>{
                const component = input.component;
                const FormComponent:React.FC<ComponentProps> = require("@mantine/core")[component];
                const IconComponent:React.FC<ComponentProps> = require("@tabler/icons-react")[component];
                
                if(input.type == "icon") {
                    return <IconComponent 
                        key={input_key}
                        className={input.style}
                    />; 
                } else {
                    let formComponent = <FormComponent 
                        key={input_key}
                        data={input.options}
                        value={input.value}
                        defaultValue={input.value}
                        className={input.style}
                        onChange={(event:React.ChangeEvent<HTMLInputElement>) => handleChangeInput(input_key, event)}
                    />; 
                    return formComponent;
                }
            })
        } 
    };
    
    const handleChangeInput = (index: number , e: React.ChangeEvent<HTMLInputElement> | string) => {
        let value='';
        
        if(typeof e == 'string') {
           value = e; 
        } else {
            value = e.target.value;
        }
        handleChangeUtilityInputsValue(index, value);
    }
    const closeModal = () => {
        setIsModal(false);
    }
    const closelimitModal = () => {
        setIsLimitModal(false);
    }
    const showSettingModal = (modal_title) => {
        setSettingTitle(modal_title);
        setSettingModal(true);
    }

    const handleSelectCustomButtons = (group_name, button_name) => {
        setButtonPrompts({
            group_name: group_name,
            button_name: button_name
        })
    }

    useEffect(() => {
        if(buttonPromts) {
            handleSend();
        }   
    }, [buttonPromts])

    useEffect(() => {
        if(isRegenerate) {
            if(selectedConversation.messages.length > 0) {
                const messages = selectedConversation.messages;
                const user_message = messages[messages.length - 1][0];
                const button_prompt = user_message.button_prompt;
                const setting_prompt = user_message.setting_prompt;
                const content = user_message.content;
                setInputContent(content);

                if(button_prompt) {
                    setButtonPrompts(buttonPromts);
                }
                let  updatedUtilty = JSON.parse(JSON.stringify(selectedUtility));
                if(setting_prompt){
                    
                    updatedUtilty.settings.map(setting=> {
                        setting.items.map((item) => {
                            let active = false;
                            setting_prompt.map(selected => {
                                if(setting.name == selected.setting_name && item.name == selected.item_name) {
                                    active = true;
                                }
                            })
                            item.active = active;
                        })
                    })   
                }
                console.log(selectedUtility);
                setUpdateUtilty(updatedUtilty);
            }
        }
    },[isRegenerate])

    const regenerate = () => {
        setIsRegenerate(true);
    }

    return (
        <Box
            sx={(theme) => ({
                display: 'flex',
                flexDirection: 'column',
            })}
        >
            <Box>
                <Space h="md"/>
                <Text 
                    sx={(theme) => ({
                        fontSize: theme.fontSizes.lg,
                        fontWeight: 600
                    })}
                >
                    {selectedUtility.name}
                </Text>
                <Text 
                    sx={(theme) => ({
                        fontSize: theme.fontSizes.sm,
                    })}
                >
                    {selectedUtility.summary}
                </Text>
                <Space h="md"/>
                {
                    selectedUtility.inputs.length > 0?
                    <Flex
                        gap="sm"
                        align='center'
                        direction={selectedUtility.input_align == "horizental"?'row':'column'}
                        sx={(theme) => ({
                            paddingLeft: theme.spacing.chatInputPadding,
                        })}
                    >
                        {
                            componentUtilityInputs()
                        }
                    </Flex>
                    :<></>
                }
                <Space h="md"/>
                <ChatInput
                    onSend={async() => {handleSend();}}
                    textareaRef={textareaRef}
                    messageIsStreaming={messageIsStreaming}
                    inputContent={inputContent}
                    setInputContent={(content)=> {setInputContent(content)}}
                    selectedConversation = {selectedConversation}
                    disabledEnter = { selectedUtility.buttonGroup.length > 0? false:true }
                    inputError={inputError}
                    selectedUtility={selectedUtility}
                />
                <Space h="md"/>
                <ButtonGroup 
                    selectedUtility={selectedUtility}
                    handleSelectCustomButtons={handleSelectCustomButtons}
                    isMobile={isMobile}
                    showSettingModal={showSettingModal}
                />
                <Space h="md" />
                {
                    selectedUtility.buttonGroup.length > 0?
                    <Output 
                        isMobile={isMobile}
                        responseText={responseText}
                        handleSend={async() => {regenerate()}}
                    />
                    :<></>
                }
                
                <Space h="md"/>
                <ChatMessage 
                    historyConversation={historyConversation}
                    messageIsStreaming={messageIsStreaming}
                    setInputContent={(content)=> {setInputContent(content)}}
                    saveSelctedConversation={saveSelectConverSation}
                    isMobile={isMobile}
                    handleChangeUtilityInputsValue = {handleChangeUtilityInputsValue}
                    selectedSearch={selectedSearch}
                    clearSelectedSearch={clearSelectedSearch}
                    selectedUtility={selectedUtility}
                    deleteConversation={deleteConversation}
                />
            </Box>
            <MyModal
                size={modalType == 'signin' || modalType == 'signup'?'  sm':'sm'}
                isModal={isModal}
                child={modalType == 'signin' || modalType == 'signup'? <AuthenticationForm modalType={modalType} closeModal={closeModal}/>:<Subscription closeModal={closeModal} />}
                title=''
                closeModal={closeModal}
                withCloseButton={false}
            />
            
            <Modal opened={settingModal} onClose={() =>{setSettingModal(false)}} title={<h2>{settingTitle}</h2>}>
                {
                    selectedUtility.settings.length == 0 ?
                    <Box sx={(theme) =>({textAlign: 'center'})}>
                        <IconMistOff size={30} className="mx-auto mb-3"/>
                        <text>
                            No Settings.
                        </text>
                    </Box>
                    :
                    selectedUtility.settings?.map((setting, setting_index) => 
                        <Flex key={setting_index} 
                            direction="column"
                            p={15}
                        >
                            <Flex
                                align='center'
                                sx={(theme) =>({
                                    border: `1px solid gray`,
                                    borderRadius: theme.spacing.md,
                                    padding: theme.spacing.md
                                })}
                                
                            >
                                <Box
                                    sx={(theme) =>({
                                        width: '40%',
                                        fontSize: '30px',
                                        textAlign: 'center'
                                    })}
                                >
                                    {setting.name}
                                </Box>
                                <Box
                                    sx={(theme) =>({
                                        width: '60%'
                                    })}
                                >  
                                    {
                                        setting.items.map((item, item_index) => 
                                        
                                            <Radio  color="gray" value={item.name} checked={item.active}  key ={item_index} label={item.name} onClick={() => {handleSelectSettings(setting_index, item_index)}} pt="md"/>
                                        )
                                    }

                                </Box>
                            </Flex>
                        </Flex>
                    )
                }
               
            </Modal>
            <MyModal
                size='sm'
                isModal={isLimitModal}
                child={<Box sx={(theme) => ({
                    padding: theme.spacing.md,
                    paddingTop: 0
                })}>
                    <Text sx={(theme) => ({
                        textAlign: 'center',
                        fontSize: theme.fontSizes.lg
                    })}>
                        You have reached free trial limit
                    </Text>
                    {
                        !user?
                        <Group position="right" sx={(theme) => ({
                            marginTop: '15px',
                        })}>
                            
                            <Button variant="outline" onClick={() => {
                                setIsLimitModal(false);
                                setModalType('signin');
                                setIsModal(true);                                
                            }}>
                                Sign In
                            </Button>
                            <Button className='bg-sky-500/100' onClick={() => {
                                setIsLimitModal(false);
                                setModalType('signup');
                                setIsModal(true);
                            }}>
                                Create Account
                            </Button>
                        </Group>:
                        <Button variant="outline" onClick={() => {
                            setModalType('subscription');
                            setIsLimitModal(false);
                            setIsModal(true);
                        }}>
                            Upgrade
                        </Button>                        
                    }
                </Box>}
                title=''
                closeModal={closelimitModal}
            />
        </Box>
    )
}

interface ComponentProps {  
    key: number;
    data?: string[] | undefined;
    defaultValue?: string | number | undefined;
    className: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value?:string;
 }
export const InputComponet = (Component: any) => {
    return (
        <Component />
    )
}

export default ChatContent;