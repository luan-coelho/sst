'use client'

import { Link, useLocation } from '@tanstack/react-router'
import { ChevronRight  } from 'lucide-react'
import type {LucideIcon} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem
} from '@/components/ui/sidebar'

export function NavMain({
    items
}: {
    items: Array<{
        title: string
        url: string
        icon?: LucideIcon
        isActive?: boolean
        items?: Array<{
            title: string
            url: string
        }>
    }>
}) {
    const location = useLocation()

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map(item => {
                    // Se o item não tem subitems, renderiza como um item normal
                    if (!item.items || item.items.length === 0) {
                        const isActive = location.pathname === item.url

                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    tooltip={item.title}
                                    asChild
                                    isActive={isActive}
                                    className="h-9 px-4">
                                    <Link to={item.url} className="flex items-center gap-3">
                                        {item.icon && (
                                            <item.icon className={isActive ? 'text-primary size-5' : 'text-zinc-400'} />
                                        )}
                                        <span
                                            className={
                                                isActive ? 'text-primary font-medium' : 'font-normal text-zinc-400'
                                            }>
                                            {item.title}
                                        </span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    }

                    // Para items com subitems, verifica se algum subitem está ativo
                    const hasActiveSubItem = item.items.some(subItem => location.pathname === subItem.url)
                    const isOpen = hasActiveSubItem || item.isActive

                    // Se tem subitems, renderiza como collapsible
                    return (
                        <Collapsible key={item.title} asChild defaultOpen={isOpen} className="group/collapsible">
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        tooltip={item.title}
                                        isActive={hasActiveSubItem}
                                        className="h-11">
                                        {item.icon && <item.icon className={hasActiveSubItem ? 'text-primary' : ''} />}
                                        <span className={hasActiveSubItem ? 'text-primary font-medium' : ''}>
                                            {item.title}
                                        </span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.items.map(subItem => {
                                            const isSubItemActive = location.pathname === subItem.url

                                            return (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        isActive={isSubItemActive}
                                                        className="h-10">
                                                        <Link to={subItem.url} className="flex items-center">
                                                            <span
                                                                className={
                                                                    isSubItemActive ? 'text-primary font-medium' : ''
                                                                }>
                                                                {subItem.title}
                                                            </span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            )
                                        })}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}
