'use client'

import * as React from 'react'
import {
  Building2,
  Clock,
  GalleryVerticalEnd,
  House,
  SquareTerminal,
  User,
} from 'lucide-react'

import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: {
    name: 'Acme Inc',
    logo: GalleryVerticalEnd,
    plan: 'Enterprise',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/',
      icon: House,
      isActive: false,
    },
    {
      title: 'Karyawan',
      url: '/karyawan',
      icon: User,
      isActive: false,
    },
    {
      title: 'Data',
      url: '#',
      icon: Clock,
      isActive: true,
      items: [
        {
          title: 'Shift',
          url: '#',
        },
        {
          title: 'Lokasi',
          url: '#',
        },
      ],
    },
    {
      title: 'Perusahaan',
      url: '#',
      icon: Building2,
      isActive: false,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <p className="text-lg font-bold">Presensi App</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
