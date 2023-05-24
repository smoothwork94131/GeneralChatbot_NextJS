import { Modal} from '@mantine/core';
import { FC } from 'react';
interface Props {
    isModal: boolean;
    child: JSX.Element
    title: String
    closeModal: ()=>void;
    size: string;
}
const MyModal:FC<Props> = ({isModal, child, title,closeModal, size}) =>{
    return (
        <>
            <Modal opened={isModal} onClose={()=>{closeModal()}}  size={size}>
                {
                    child
                }
            </Modal>
        </>
    );
}

export default MyModal;