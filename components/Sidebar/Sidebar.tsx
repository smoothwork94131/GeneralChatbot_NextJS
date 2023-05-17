import { FC, useContext} from 'react';
import Search from '@/components/Search';
import Utils from '@/components/Utils';
import Settings from '@/components/Settings';
import OpenaiContext from '@/components/openai/openai.context';
import { useDisclosure } from "@mantine/hooks";
import { useState, useEffect } from 'react';

import { 
    Navbar,
    createStyles,
    Text,
    Flex
 } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { SelectedSearch, UtilitiesGroup } from '@/types/role';

interface Props {
    isMobile: boolean
    handleShowSidebar:() => void;
    openedSidebar: boolean;
    className?:string;
    selectedSearch: SelectedSearch;
    updateServerRoleData: () =>void;
}

const useStyles = createStyles<string, { collapsed?: boolean }>(
    (theme, params, getRef) => {
      return {
        navbar: {
          position: "sticky",
          top: 0,
          width: params?.collapsed ? 81 : 264,
          transition: params?.collapsed ? "width 0.1s linear" : "none",
        },
        footer: {
            paddingTop: theme.spacing.xs,
            marginTop: theme.spacing.md,
            borderTop: `1px solid ${theme.colors.gray[2]}`,
        },
      };
    }
);

const Sidebar: FC<Props> = ({isMobile, className, handleShowSidebar, updateServerRoleData}) =>{
    const {
        state: { selectedUtilityGroup, selectedUtility, roleGroup },
        handleSelectUtility,
        dispatch: openAiDispatch
    } = useContext(OpenaiContext);
    const [filterUtilityGroup, setFilterUtilityGroup] = useState<UtilitiesGroup[]>(selectedUtilityGroup);
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    
    
    const onSearchUtility = (keyword: string) => {
        setSearchKeyword(keyword);
    }
    
    useEffect(()=> {
        let updatedUtilityGroup: UtilitiesGroup[] = [];
        for(let k=0; k<selectedUtilityGroup.length;k++){
            let group_item = selectedUtilityGroup[k];
            const filter_utilities = group_item.utilities.filter((u_item) => {
                const searchable = u_item.name.toLowerCase() +
                ' '+u_item.summary.toLowerCase();
                return searchable.includes(searchKeyword.toLowerCase())
            })

            if(filter_utilities.length > 0) {
                group_item = {
                    ...group_item,
                    utilities: filter_utilities,
                    active: (searchKeyword !="") ||
                            (group_item.active)? true:false
                }
                updatedUtilityGroup.push(group_item);
            }
        }
        setFilterUtilityGroup(updatedUtilityGroup);
    },[searchKeyword, selectedUtilityGroup, roleGroup])

    useEffect(()=> {

    },[])

    const collpaseUtiltyGroup = (group_name: string) => {
        let updatedUtilityGroup = filterUtilityGroup;
        updatedUtilityGroup = updatedUtilityGroup.map((item) =>{
            if(item.name == group_name){
                item = {
                    ...item,
                    active: !item.active
                };
            }
            return item;
        })

        const updated_role_Group = roleGroup.map((role_item) => {
            const filter_utility_group = role_item.utilities_group.map((group_item) => {
                const group = updatedUtilityGroup.filter(updated_group_item => updated_group_item.name == group_item.name)
                if(group.length > 0) {
                    group_item.active = group[0].active;
                }
                return group_item;
            })
            role_item.utilities_group = filter_utility_group;
            return role_item;
        })
        openAiDispatch({
            field: 'roleGroup',
            value: updated_role_Group
        })
    }

    const [collapsed, handlers] = useDisclosure(false);
    const { classes, cx } = useStyles({ collapsed });
    return (
        <Navbar 
            sx={(theme) => ({
                padding: theme.spacing.sm,
                background: 'none',
                borderRight: `1px solid ${theme.colorScheme == 'dark'? theme.colors.gray[8]: theme.colors.gray[1]}`,
            })}
            className={cx(classes.navbar, className)}
        >
            {
                isMobile?
                <Flex 
                    gap='sm'
                    align='center'
                >
                    <Search 
                        onSearchUtility={onSearchUtility}
                    />
                    <Text sx={(theme) => ({
                            color: theme.colors.gray[7]
                        })}>
                        <IconArrowLeft 
                            onClick={handleShowSidebar}  
                        />        
                    </Text>
                </Flex>:
                <Search 
                    onSearchUtility = {onSearchUtility}
                />
            }
            <Utils 
                selectedUtilityGroup = { filterUtilityGroup }
                handleSelectUtility = {handleSelectUtility}
                selectedUtility = {selectedUtility}
                collpaseUtiltyGroup = {collpaseUtiltyGroup}
            />
            {
                !isMobile?
                <Settings 
                    isMobile={isMobile}
                    updateServerRoleData={updateServerRoleData}
                />:<></>
            }
        </Navbar>
    )
}
export default Sidebar; 