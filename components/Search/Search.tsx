import { Input } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { FC } from 'react';
interface Props{
    onSearchUtility: (keyword: string)=>void;
}
const Search:FC<Props> = ({onSearchUtility}) =>{
    const handleChange = (e:  React.ChangeEvent<HTMLInputElement>) => {
        const keyword = e.target.value;
        e.preventDefault();
        onSearchUtility(keyword);
    };
    return (
        <Input
            placeholder="Search"
            rightSection={
                <IconSearch size="1rem" className="opacity-[0.5]"/>
            }
            onChange={handleChange}
            className="w-full"
        />
    )
}

export default Search;
