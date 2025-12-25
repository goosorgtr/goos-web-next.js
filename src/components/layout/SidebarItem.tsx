'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type LucideIcon } from 'lucide-react'
import { useSidebarStore } from '@/store/sidebar-store'
import { cn } from '@/lib/utils'

interface SidebarItemProps {
    id: string
    label: string
    href: string
    icon: LucideIcon
    badge?: number
    isChild?: boolean
}

export function SidebarItem({
    id,
    label,
    href,
    icon: Icon,
    badge,
    isChild = false,
}: SidebarItemProps) {
    const pathname = usePathname()
    const { setActiveItem, closeMobileSidebar } = useSidebarStore()

    const isActive = pathname === href

    const handleClick = () => {
        setActiveItem(id)
        closeMobileSidebar()
    }

    return (
        <Link
            href={href}
            onClick={handleClick}
            className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isChild && 'pl-11',
                isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
            )}
        >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <span className="flex-1">{label}</span>
            {badge !== undefined && badge > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {badge}
                </span>
            )}
        </Link>
    )
}
