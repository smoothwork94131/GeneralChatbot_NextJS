import { 
    Group,
    Button, 
    Text
} from "@mantine/core";
import { useUser } from '@supabase/auth-helpers-react';
import { getUserTimes, chkIsSubscription, getActiveProductsWithPrices } from "@/utils/app/supabase-client";
import { useEffect, useState, FC } from "react";
import MyModal from "@/components/Account/Modal";
import {AuthenticationForm} from "@/components/Account/AuthenticationForm";
import Subscription from "@/components/Account/Subscription";
import { Product } from "@/types/user";
import { Conversation } from "@/types/chat";

interface Props {
    selectedConversation: Conversation,
    isMobile: boolean;
}

const AccountButtons:FC<Props> = ({selectedConversation, isMobile}) => {
    const [isSubscription , setSubscription ] = useState<boolean>(false);
    const [times, setTimes] = useState<number>(0);
    const [isModal, setIsModal] = useState<boolean>(false);
    const [modalType, setModalType] = useState<string>('auth');
    
    const [products, setProducts] = useState<Product[]>([]);
    const user = useUser();

    useEffect(() => {
        const fetchData = async() => {
            const userTimes = await getUserTimes(user);
            setTimes(userTimes);
        }
        fetchData();
    }, [selectedConversation]);

    useEffect(() => {
        const fetchData = async() => {
            const data = await chkIsSubscription(user);
            const products = await getActiveProductsWithPrices();
            setProducts(products);
            setSubscription(data);
        }
        fetchData();
    },[user])

    const closeModal = () => {
        setIsModal(false);
    }
    const showModal = (type) => {
        setModalType(type);
        setIsModal(true);
    }
    return (
        <Group>
            {
                !isSubscription?
                <Text>
                    {
                        times
                    } prompts left
                </Text>:<></>    
            }
            {
                !isMobile?
                user?
                    !isSubscription?
                    <Group>
                        {
                            <Button variant="outline" size="xs" onClick={() => {showModal('upgrade')}}>
                                Upgrade
                            </Button>
                        }
                    </Group>:<></>
                :
                <Group>
                    <Button variant="outline" size="xs" onClick={() => {showModal('auth')}}>
                        Sign In
                    </Button>
                </Group>:<></>
            }
            <MyModal
                size={modalType == 'auth'?'sm':'xl'}
                isModal={isModal}
                child={modalType == 'auth'? <AuthenticationForm />:<Subscription products={products}/>}
                title=''
                closeModal={closeModal}
            />
        </Group>
    )
}

export default AccountButtons;