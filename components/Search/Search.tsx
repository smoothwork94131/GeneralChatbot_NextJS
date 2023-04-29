import { Input } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { FC } from 'react';
interface Props{
    
}
const Search:FC<Props> = ({}) =>{
    return (
        <div className='pt-1'>
            
            <Input
                placeholder="Search"
                rightSection={
                    <div>
                        <IconSearch size="1rem" style={{ display: 'block', opacity: 0.5 }} />
                    </div>
                }
            />
            
        </div>
    )
}

export default Search;
