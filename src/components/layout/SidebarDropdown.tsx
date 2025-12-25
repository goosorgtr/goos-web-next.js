'use client'

import { useState } from 'react'
import { ChevronDown, type LucideIcon } from 'lucide-react'
import { SidebarItem } from './SidebarItem'
import { cn } from '@/lib/utils'
import type { SidebarItem as SidebarItemType } from '@/config/sidebar-config'

interface SidebarDropdownProps {
    id: string
    label: string
    icon: LucideIcon
    children: SidebarItemType[]
}

export function SidebarDropdown({ id, label, icon: Icon, children }: SidebarDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)

    const toggleDropdown = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div>
            <button
                onClick={toggleDropdown}
                className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    'text-gray-700 hover:bg-gray-100'
                )}
            >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="flex-1 text-left">{label}</span>
                <ChevronDown
                    className={cn(
                        'h-4 w-4 transition-transform duration-200',
                        isOpen && 'rotate-180'
                    )}
                />
            </button>

            {isOpen && (
                <div className="mt-1 space-y-1">
                    {children.map((child) => (
                        <SidebarItem
                            key={child.id}
                            id={child.id}
                            label={child.label}
                            href={child.href}
                            icon={child.icon}
                            badge={child.badge}
                            isChild
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
