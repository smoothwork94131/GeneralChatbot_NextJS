import { Box, Modal} from '@mantine/core';
import { FC } from 'react';
interface Props {
    isModal: boolean;
    child: JSX.Element
    title: String
    closeModal: ()=>void;
    size: string;
    withCloseButton: boolean;
}
const MyModal:FC<Props> = ({isModal, child, title, closeModal, size, withCloseButton}) =>{
    return (
        <>
            <Modal opened={isModal} onClose={()=>{closeModal()}}  size={size} withCloseButton={withCloseButton}>
                {
                    child
                }
            </Modal>
        </>
    );
}

export default MyModal;