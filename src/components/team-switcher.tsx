'use client'

import { GalleryVerticalEnd } from 'lucide-react'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

export function TeamSwitcher() {
    return (
        <SidebarMenu className="pointer-events-none">
            <SidebarMenuItem>
                <SidebarMenuButton
                    size="lg"
                    tabIndex={0}
                    aria-label="SST AuditorIA"
                    className="text-sidebar-accent-foreground">
                    <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                        <GalleryVerticalEnd className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">SST</span>
                        <span className="truncate text-xs">AuditorIA</span>
                    </div>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
