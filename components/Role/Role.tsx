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
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext, PointerSensor, useSensor } from '@dnd-kit/core';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import {
    useSensors,
    KeyboardSensor,
    closestCenter,
} from "@dnd-kit/core";
import { css } from '@emotion/css';
import { CSS } from '@dnd-kit/utilities';
import { Tabs } from 'antd';
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
    key: string,
    label: string,
    children: string
}
const RoleHome: FC<Props> = ({handleSelectRole,roleGroup, selectedRole,isMobile}) => {

    const [roleOrder, setRoleOrder] = useState<RoleOrderItem[]>([]);
    const [showMenu, setShowMenu] = useState<boolean>(false);

    useEffect(() => {
        const roleOrderStr:string|null = localStorage.getItem("roleOrder");
        if(roleOrderStr) {
            const roleOrder = JSON.parse(roleOrderStr);
            if(roleOrder.length > 0) {            
                setRoleOrder(roleOrder);
            }else {
                
                let order:RoleOrderItem[] = [];
                roleGroup.map((item, index) => {
                    order.push({
                        key: index.toString(),
                        label: item.name,
                        children:''
                    })
                })
                setRoleOrder(order);
            }
        } 
    }, []);

    useEffect(()=> {
        if(roleGroup.length == 0) return; 
        localStorage.setItem("roleOrder", JSON.stringify(roleOrder));
    }, [roleOrder]);

    const [className, setClassName] = useState('');
    const sensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } });
    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (active.id !== over?.id) {
            setRoleOrder((prev) => {
                const activeIndex = prev.findIndex((i) => i.key === active.id);
                const overIndex = prev.findIndex((i) => i.key === over?.id);
                return arrayMove(prev, activeIndex, overIndex);
            });
        }
    };

    const clickDestkopTab = (key: string, event: React.KeyboardEvent<Element> | React.MouseEvent<Element, MouseEvent>) => {
        handleSelectRole(Number(key));
    }
    const clickMobileTab = (key: string) => {
        handleSelectRole(Number(key));
        setShowMenu(false);
    }
    
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
          coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    function handleDragEnd(event) {
        const { active, over } = event;
        if (active?.id !== over?.id) {
          setRoleOrder((prev) => {
            const activeIndex = prev.findIndex((item) => item.key === active?.id);
            const overIndex = prev.findIndex((item) => item.key === over?.id);
            return arrayMove(prev, activeIndex, overIndex);
          });
        }
    }

   

    const mobileRoleOrder = () => {
        let parse_order = roleOrder.map((item) => {
            return {
                id: item.key,
                title: item.label,
                description: ''
            }
        })
        return parse_order;
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
                                items={mobileRoleOrder()}
                                strategy={verticalListSortingStrategy}
                            >
                            <ul>
                                {mobileRoleOrder().map((item) => (
                                    <Box key={item.id} onClick={() => {clickMobileTab(item.id)}}>
                                        <SortableItem key={item.id} item={item} />
                                    </Box>  
                                ))}
                            </ul>
                            </SortableContext>
                        </DndContext>
                    </Box>
            </Menu.Dropdown>
        </Menu>
        :
        <Tabs
            className={className}
            items={roleOrder}
            onTabClick={clickDestkopTab}
            renderTabBar={(tabBarProps, DefaultTabBar) => (
                <DndContext sensors={[sensor]} onDragEnd={onDragEnd}>
                    <SortableContext items={roleOrder.map((i) => i.key)} strategy={horizontalListSortingStrategy}>
                        <DefaultTabBar {...tabBarProps} >
                            {(node) => (
                                <DraggableTabNode
                                    {...node.props}
                                    key={node.key}
                                    onActiveBarTransform={setClassName}
                                >
                                    {node}
                                </DraggableTabNode>
                            )}
                        </DefaultTabBar>
                    </SortableContext>
                </DndContext>
            )}
        />
    )
}

interface DraggableTabPaneProps extends React.HTMLAttributes<HTMLDivElement> {
    'data-node-key': string;
    onActiveBarTransform: (className: string) => void;
}

const DraggableTabNode = ({ className, onActiveBarTransform, ...props }: DraggableTabPaneProps) => {
    const { attributes, listeners, setNodeRef, transform, transition, isSorting } = useSortable({
      id: props['data-node-key'],
    });
    const {colorScheme} = useMantineColorScheme();
    props.style ={
        color: colorScheme == 'dark'? '#C1C2C5':'black'
    }
    const style: React.CSSProperties = {
      ...props.style,
      transform: CSS.Transform.toString(transform),
      transition,
      cursor: 'move',
    };

    useEffect(() => {
        if (!isSorting) {
          onActiveBarTransform('');
        } else if (className?.includes('ant-tabs-tab-active')) {
          onActiveBarTransform(
            css`
              .ant-tabs-ink-bar {
                transform: ${CSS.Transform.toString(transform)};
                transition: ${transition} !important;
              }
            `,
          );
        }
    }, [className, isSorting, transform]);
    
    return React.cloneElement(props.children as React.ReactElement, {
      ref: setNodeRef,
      style,
      ...attributes,
      ...listeners,
    });
};


function SortableItem({ item }) {
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
            node={setActivatorNodeRef}
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