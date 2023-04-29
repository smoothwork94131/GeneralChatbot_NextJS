import { FC } from 'react';
interface Props {
    text: string;
    icon: JSX.Element;
    onClick: () => void;
  }

const SettingButton:FC<Props> = ({ text, icon, onClick }) => {
    return (
        <button
            className="flex w-full cursor-pointer select-none items-center gap-3 rounded-md py-2 px-2 text-[14px] leading-3 text-black transition-colors duration-200 hover:bg-gray-300"
            onClick={onClick}
        >
            <div className='text-gray-500'>{icon}</div>
            <span className='text-gray-500'>{text}</span>
        </button>
    )
}

export default SettingButton;