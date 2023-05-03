import { FC } from 'react';
import { Text } from '@mantine/core';
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
            <Text 
                sx={(theme) => ({
                    color: theme.colors.gray[7],
                })}>{icon}
            </Text>
            <Text
                sx={(theme) =>({
                    color: theme.colors.gray[7],
                    fontWeight: 600,
                    fontSize: theme.fontSizes.md
                })}
            >{text}</Text>
        </button>
    )
}

export default SettingButton;