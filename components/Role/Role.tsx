import { FC, useEffect, useState } from 'react';
import { 
    Flex, 
    Menu, 
    rem, 
    UnstyledButton, 
    Text ,
    Group,
    Box,
    Tabs
} from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { RoleGroup } from '@/types/role';
import { IconChevronDown } from '@tabler/icons-react';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext, PointerSensor, useSensor } from '@dnd-kit/core';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
  
} from '@dnd-kit/sortable';
import {
    useSensors,
    KeyboardSensor,
    closestCenter,
    MouseSensor,
    TouchSensor,
} from "@dnd-kit/core";

import { css } from '@emotion/css';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';
import { GripVertical } from "lucide-react";
import { useMantineColorScheme } from '@mantine/core';

interface  Props {
    handleSelectRole: (index: number) => void;
    roleGroup: RoleGroup[]
    selectedRole: RoleGroup;
    isMobile: boolean;
}

interface RoleOrderItem {
    id: string,
    title: string,
}
const RoleHome: FC<Props> = ({handleSelectRole,roleGroup, selectedRole,isMobile}) => {

    const getStorageOrder = () => {
        const roleOrderStr = localStorage.getItem("roleOrder");
        if(!roleOrderStr) {
            return [];
        } else {
            return JSON.parse(roleOrderStr);
        }
    }
    
    const [roleOrder, setRoleOrder] = useState<RoleOrderItem[]>(getStorageOrder());
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [isDragging, setIsDragging] = useState(false);
    
    useEffect(() => {
        initRoleOrder();
    }, [roleGroup]);

    useEffect(() => {
        initRoleOrder();
    }, []);
    
    
    useEffect(()=> {
        
        if(roleGroup.length == 0) return; 
        localStorage.setItem("roleOrder", JSON.stringify(roleOrder));

    }, [roleOrder]);
   
    const [className, setClassName] = useState('');
    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

    const initRoleOrder = () => {
        const roleOrderStr:string|null = localStorage.getItem("roleOrder");

        if(roleOrderStr) {
            const roleOrder = JSON.parse(roleOrderStr);
            if(roleOrder.length > 0) {            
                setRoleOrder(roleOrder);
            } else {
                let order:RoleOrderItem[] = [];
                roleGroup.map((item, index) => {
                    order.push({
                        id: index.toString(),
                        title: item.name,
                    })
                })
                setRoleOrder(order);
            }
        } else {            
            let order:RoleOrderItem[] = [];
            roleGroup.map((item, index) => {
                order.push({
                    id: index.toString(),
                    title: item.name,
                })
            })
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
            setActivatorNodeRef,
            transform,
            transition,
          } = useSortable({
            id: item.id,
          });
        
        const style = {
            transform: CSS.Transform.toString(transform),
            transition,
            cursor: 'move',
        };
        
        return (
            
            <Flex 
                ref={setNodeRef} style={style} {...attributes} {...listeners}
                onClick={() => {clickDestkopTab(item.id)}}
                sx={(theme) => ({
                    padding: theme.spacing.sm,
                    marginLeft: theme.spacing.sm,   
                    textAlign: 'center',
                    cursor: 'pointer',
                    borderBottom: `2px solid ${theme.colors.orange[selectedRole.name == item.title? 8:2]}`,
                    "&:hover" :{
                        borderBottom: `2px solid ${theme.colors.orange[8]}`
                    }
                })}
                gap="xs"
                justify="flex-start"
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
    return (
        isMobile?
        <Menu openDelay={100} closeDelay={400} zIndex={1000} opened={showMenu}>
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
                <Box sx={(theme) =>({
                    padding: theme.spacing.xs
                })}>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={roleOrder}
                            strategy={verticalListSortingStrategy}
                        >
                        <ul>
                            {roleOrder.map((item) => (
                                <Box key={item.id} onClick={() => {clickMobileTab(item.id)}}>
                                    <SortableMobileItem key={item.id} item={item} />
                                </Box>  
                            ))}
                        </ul>
                        </SortableContext>
                    </DndContext>
                </Box>
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
                    {roleOrder.map((item) => (
                        <Box key={item.id} 
                        >
                            <SortableDesktopItem key={item.id} item={item} />
                        </Box>  
                    ))}
                </Flex>
            </SortableContext>
        </DndContext>
        
       
    )
}


function SortableMobileItem({ item }) {
    const {
      attributes,
      listeners,
      setNodeRef,
      setActivatorNodeRef,
      transform,
      transition,
    } = useSortable({
      id: item.id,
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
export default RoleHome;