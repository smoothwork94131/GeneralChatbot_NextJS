import { FC, useEffect, useState } from 'react';
import { 
    Flex, 
    Menu, 
    rem, 
    UnstyledButton, 
    Text ,
    Group,
    Box
} from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { RoleGroup } from '@/types/role';
import { IconChevronDown } from '@tabler/icons-react';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  
} from '@dnd-kit/sortable';

import {
    useSensors,
    closestCenter,
    MouseSensor,
    TouchSensor,
    DndContext,
    useSensor
} from "@dnd-kit/core";

import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from "lucide-react";
import Link from 'next/link';


interface  Props {
    handleSelectRole: (index: number) => void;
    roleGroup: RoleGroup[]
    selectedRole: RoleGroup;
    isMobile: boolean;
}

interface RoleOrderItem {
    id: string,
    title: string,
    active: boolean
}
const RoleHome: FC<Props> = ({handleSelectRole, roleGroup, selectedRole, isMobile}) => {
    const getStorageOrder = () => {
        const roleOrderStr = localStorage.getItem("roleOrder");
        
        if(roleOrderStr && 
            JSON.parse(roleOrderStr).length > 0
        ) {
            let roleOrder = JSON.parse(roleOrderStr);
            roleGroup.map((role) => {
                const select_ = roleOrder.filter(order => role.name == order.title);
                if(select_.length == 0) {
                    roleOrder.push({
                        id: roleOrder.length.toString(),
                        title: role.name,
                        active:false
                    })
                
                }
            });
            return roleOrder;   
        } else {
            let order:RoleOrderItem[] = [];
            roleGroup.map((item, index) => {
                let active = false;
                if(selectedRole.name == item.name) {
                    active = true;
                }
                order.push({
                    id: index.toString(),
                    title: item.name,
                    active: active
                });
            });
            return order;
        }
    }

    const temp_order = getStorageOrder();
    const [roleOrder, setRoleOrder] = useState<RoleOrderItem[]>(temp_order);
    // const [roleOrder, setRoleOrder] = useState<RoleOrderItem[]>([]);
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [isDragging, setIsDragging] = useState(false);

    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
    
    useEffect(() => {
        initRoleOrder();
    }, [roleGroup]);

    useEffect(() => {
        initRoleOrder();
    }, []);
    
    useEffect(()=> {
        if(roleGroup.length == 0) return;

        let updated_roleOrder:RoleOrderItem[] =[];
        roleOrder.map((item) => {
            let active = false ;
            if(item.title == selectedRole.name) {
                active = true;
            }
            item.active = active
            updated_roleOrder.push(item);
        })

        setRoleOrder(updated_roleOrder);
        localStorage.setItem("roleOrder", JSON.stringify(roleOrder));

    }, [selectedRole]);
   
    const initRoleOrder = () => {
        const roleOrderStr:string|null = localStorage.getItem("roleOrder");
        if(roleOrderStr) {
            const roleOrder = JSON.parse(roleOrderStr);
            if(roleOrder.length > 0) {       
                roleGroup.map((role) => {
                    const select_ = roleOrder.filter(order => role.name == order.title);
                    if(select_.length == 0) {
                        roleOrder.push({
                            id: roleOrder.length.toString(),
                            title: role.name,
                            active:false
                        })
                        setRoleOrder(roleOrder);
                    }
                });
                
                localStorage.setItem("roleOrder", JSON.stringify(roleOrder));

            } else {
                let order:RoleOrderItem[] = [];
                roleGroup.map((item, index) => {
                    let active = false;
                    if(selectedRole.name == item.name) {
                        active = true;
                    }
                    order.push({
                        id: index.toString(),
                        title: item.name,
                        active: active
                    });
                });
                setRoleOrder(order);
            }
        } else {            
            let order:RoleOrderItem[] = [];
            roleGroup.map((item, index) => {
                let active = false;
                if(selectedRole.name == item.name) {
                    active = true;
                }
                order.push({
                    id: index.toString(),
                    title: item.name,
                    active: active
                });
            });
            setRoleOrder(order);
        }
    }
    
    const clickDestkopTab = (key: string) => {
        handleSelectRole(Number(key));
    }
    
    const clickMobileTab = (key: string) => {
        handleSelectRole(Number(key));
        setShowMenu(false);
    }
    
    const getUrl = (role_name) => {
        let url = '';
        roleGroup.map((role) => {
            if(role.name == role_name) {
                role.utilities_group.map(group => {
                    group.utilities.map(utility => {
                        if(utility.active) {
                            url = `/${role.name}/${group.name}/${utility.name}`;
                        }
                    })
                })
            }
        })
        return url;
    }
    
    function handleDragMove(event) {
        setIsDragging(true);
    }

    function handleDragEnd(event) {
        const { active, over } = event;
        if(!isDragging) {
            handleSelectRole(active?.id);
        }
        if (active?.id !== over?.id) {
          setRoleOrder((prev) => {
            const activeIndex = prev.findIndex((item) => item.id === active?.id);
            const overIndex = prev.findIndex((item) => item.id === over?.id);
            return arrayMove(prev, activeIndex, overIndex);
          });
        }
        setIsDragging(false);
    }

    function SortableDesktopItem({item}) {
        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
          } = useSortable({
            id: item.id,
            resizeObserverConfig: {}
        });
        
        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
            cursor: 'cursor',
        };
        
        return (
                <Flex  ref={setNodeRef} style={style} {...attributes} {...listeners}
                    sx={(theme) => ({
                        padding: theme.spacing.sm,
                        marginLeft: theme.spacing.sm,   
                        textAlign: 'center',
                        width: '130px',
                        borderBottom: `2px solid ${theme.colors.orange[selectedRole.name == item.title? 8:2]}`,
                        "&:hover" :{
                            borderBottom: `2px solid ${theme.colors.orange[8]}`
                        },
                        position: 'relative',
                        zIndex: 100
                    })}
                    gap="xs"
                    justify="center"
                    align="center"
                >
                    <Text 
                        className={`bg-[#858C94] rounded-full w-[16px] h-[16px]  text-white p-[2px]`}
                    >
                        <IconCheck size={12}/>
                    </Text>
                    <Text
                        sx={(theme) =>({
                        fontSize: theme.fontSizes.md,
                        })}
                    >
                        {
                            item.title
                        }
                    </Text>
                </Flex> 
        );
    }

    function SortableMobileItem({ item }) {
        const {
          attributes,
          listeners,
          setNodeRef,
          transform,
          transition,
        } = useSortable({
          id: item.id,
          resizeObserverConfig: {}
        });
    
        const style = {
          transform: CSS.Transform.toString(transform),
          transition,
        };
        return (
            <li
            ref={setNodeRef}
            style={style}
            {...attributes}
            className="p-2 flex gap-3"
          >
            <div className="w-full">
              <Text>{item.title}</Text>
            </div>
            <Box
                {...listeners}
                sx={(theme) =>({
                    cursor: 'cursor-grab',
                    display: 'flex',
                    padding: theme.spacing.sx,
                    alignItems: 'center'
                })}
            >
              <GripVertical className="w-4 h-4" />
            </Box>
          </li>
        );
    }

    return (
        isMobile?
        <Menu openDelay={100} closeDelay={400} zIndex={1000} >
            <Menu.Target>
                <UnstyledButton
                    onClick={()=>{setShowMenu(!showMenu)}}
                >
                    <Group spacing={3}>
                        <Text
                            sx={(theme) => ({
                                fontWeight: 600,
                            })}
                        >{selectedRole.name}</Text>
                        <Text
                            sx={(theme) => ({
                                fontWeight: 600,
                            })}
                        >
                            <IconChevronDown size={rem(17)} stroke={1.5} />
                        </Text>
                    </Group>
                </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown> 
                <Menu.Item>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        onDragMove={handleDragMove}
                    >
                        <SortableContext
                            items={roleOrder}
                            strategy={verticalListSortingStrategy}
                        >
                            <ul>
                                {roleOrder.map((item, index) => (
                                    <Box key={item.id} onClick={()=>{handleSelectRole(Number(item.id))}}><SortableMobileItem item={item} /></Box>
                                ))}
                            </ul>
                            
                        </SortableContext>
                    </DndContext>
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
        :
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragMove={handleDragMove}
        >
            <SortableContext
                items={roleOrder.map((i) => i.id)}
                strategy={horizontalListSortingStrategy}
            >
                <Flex>
                    {roleOrder.map((item, index) => (
                        <Box key={item.id}>
                            <SortableDesktopItem key={item.id} item={item} />
                        </Box>  
                    ))}
                </Flex>
            </SortableContext>
        </DndContext>
    )
}

export default RoleHome;