import { FC } from "react"
import { Box, Highlight, NavLink, Group, Text } from '@mantine/core';
import { UtilitiesGroup, Utility } from "@/types/role";
import { IconMistOff } from '@tabler/icons-react';

interface Props {
    utilityGroup: UtilitiesGroup[],
    searchKeyword: string,
    handleSelectUtility: (utility_key:string) => void;
}
const SearchList: FC<Props> = ({
    utilityGroup,
    searchKeyword,
    handleSelectUtility
}) =>{
    console.log(searchKeyword);
    return (
        <Box
        sx={(theme) =>({
            flexGrow: 1,
            zIndex: 100,
            overflow: 'auto',
            paddingTop: theme.spacing.md
        })}
        >
            {
                utilityGroup.length == 0?
                <Box sx={(theme) => ({
                    fontSize: 14,
                     textAlign:'center'
                 })}>
                     <IconMistOff size={30} className="mx-auto mb-3"/>
                     <text>
                         No data.
                     </text>
                 </Box>:
                utilityGroup.map((group) => 
                    group.utilities.map((utility, key) => 
                        <Box key={key}>
                        <NavLink 
                            onClick={() => {handleSelectUtility(utility.key); }}
                            label={
                            <Box>
                                <Box
                                >
                                    <Group spacing="5px">
                                        <Text>
                                            {group.name} 
                                        </Text>
                                        <Text>
                                            {'>'}
                                        </Text>
                                        <Highlight highlight={searchKeyword}>
                                            {utility.name}
                                        </Highlight>
                                    </Group>
                                </Box>
                                <Box
                                    sx={(theme)=>({
                                        padingLeft: 'sm',
                                        fontSize: theme.fontSizes.xs,
                                        textOverflow: "ellipsis"
                                    })}
                                >
                                    <Highlight highlight={searchKeyword}>
                                        {utility.summary}
                                    </Highlight>
                                </Box>
                            </Box>
                        } />
                    </Box>   
                    )
                )
            }
        </Box>
    )
}

export default SearchList;