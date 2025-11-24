'use client'

import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import { TeamSwitcher } from '@/components/team-switcher'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar'
import { Cloud, House, Server, Users } from 'lucide-react'
import * as React from 'react'

const items = [
  {
    title: 'Home',
    url: '/',
    icon: House
  },
  {
    title: 'Usuários',
    url: '/users',
    icon: Users
  },
  {
    title: 'SOC',
    url: '/soc',
    icon: Server
  },
  {
    title: 'S3 Storage',
    url: '/s3',
    icon: Cloud
  }
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={items} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
