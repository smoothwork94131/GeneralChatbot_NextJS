import { Input } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { FC } from 'react';
interface Props{
    
}
const Search:FC<Props> = ({}) =>{
    return (
        <Input
            placeholder="Search"
            rightSection={
                <IconSearch size="1rem" style={{ display: 'block', opacity: 0.5 }} />
            }
            width={250}
        />
    )
}

export default Search;
