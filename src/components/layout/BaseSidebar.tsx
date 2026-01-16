'use client'

import { GraduationCap } from 'lucide-react'
import { SidebarItem } from './SidebarItem'
import { SidebarDropdown } from './SidebarDropdown'
import { LogoutButton } from './LogoutButton'
import type { SidebarConfig } from '@/config/sidebar-config'
import type { User } from '@/contexts/auth-context'
import { ScrollArea } from '@/components/ui/scroll-area'

interface BaseSidebarProps {
    config: SidebarConfig
    user: User
}

export function BaseSidebar({ config, user }: BaseSidebarProps) {
    return (
        <div className="flex h-full flex-col bg-white">
            {/* Header */}
            <div className="border-b p-4">
                <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                        <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">{config.title}</h2>
                        {config.subtitle && (
                            <p className="text-xs text-gray-500">{config.subtitle}</p>
                        )}
                    </div>
                </div>

                {/* User Info - Öğrenci için */}
                {(user.role === 'OGRENCI') && (
                    <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300">
                            <span className="text-sm font-semibold text-gray-700">
                                {user.name.charAt(0)}
                            </span>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">
                                {user.role === 'OGRENCI' && user.class && `Öğrenci - ${user.class}`}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Items */}
            <ScrollArea className="flex-1 px-3 py-4">
                <nav className="space-y-1">
                    {config.items.map((item) => {
                        if (item.children && item.children.length > 0) {
                            return (
                                <SidebarDropdown
                                    key={item.id}
                                    id={item.id}
                                    label={item.label}
                                    icon={item.icon}
                                >
                                    {item.children}
                                </SidebarDropdown>
                            )
                        }

                        return (
                            <SidebarItem
                                key={item.id}
                                id={item.id}
                                label={item.label}
                                href={item.href}
                                icon={item.icon}
                                badge={item.badge}
                            />
                        )
                    })}
                </nav>
            </ScrollArea>

            {/* Logout Button */}
            <div className="border-t p-3">
                <LogoutButton />
            </div>
        </div>
    )
}
