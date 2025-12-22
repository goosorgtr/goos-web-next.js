import { redirect } from 'next/navigation'
import type { Role, Module, Permission } from '@/types/roles'
import { hasPermission, hasModuleAccess } from '@/lib/permissions/role-permissions'

/**
 * İzin kontrolü için middleware hook
 * 
 * @example
 * ```tsx
 * // Component içinde kullanım
 * const { canCreate, canEdit, canDelete } = usePermissions('OGRETMEN', 'odev')
 * 
 * return (
 *   <>
 *     {canCreate && <CreateButton />}
 *     {canEdit && <EditButton />}
 *     {canDelete && <DeleteButton />}
 *   </>
 * )
 * ```
 */
export function usePermissions(role: Role, module: Module) {
    return {
        canCreate: hasPermission(role, module, 'create'),
        canRead: hasPermission(role, module, 'read'),
        canUpdate: hasPermission(role, module, 'update'),
        canDelete: hasPermission(role, module, 'delete'),
        hasAccess: hasModuleAccess(role, module),
    }
}

/**
 * Server-side izin kontrolü
 * Erişim yoksa kullanıcıyı yönlendirir
 * 
 * @example
 * ```tsx
 * // Server Component içinde
 * export default async function Page() {
 *   const session = await getServerSession()
 *   requirePermission(session.user.role, 'odev', 'create')
 *   
 *   // İzin varsa devam eder
 *   return <CreateHomeworkForm />
 * }
 * ```
 */
export function requirePermission(
    role: Role,
    module: Module,
    permission: Permission
): void {
    if (!hasPermission(role, module, permission)) {
        redirect('/unauthorized')
    }
}

/**
 * Server-side modül erişim kontrolü
 * Erişim yoksa kullanıcıyı yönlendirir
 * 
 * @example
 * ```tsx
 * export default async function Page() {
 *   const session = await getServerSession()
 *   requireModuleAccess(session.user.role, 'kantin')
 *   
 *   return <KantinDashboard />
 * }
 * ```
 */
export function requireModuleAccess(role: Role, module: Module): void {
    if (!hasModuleAccess(role, module)) {
        redirect('/unauthorized')
    }
}

/**
 * Client-side izin kontrolü componenti
 * 
 * @example
 * ```tsx
 * <PermissionGuard role="OGRETMEN" module="odev" permission="create">
 *   <CreateHomeworkButton />
 * </PermissionGuard>
 * ```
 */
interface PermissionGuardProps {
    role: Role
    module: Module
    permission: Permission
    children: React.ReactNode
    fallback?: React.ReactNode
}

export function PermissionGuard({
    role,
    module,
    permission,
    children,
    fallback = null,
}: PermissionGuardProps) {
    if (!hasPermission(role, module, permission)) {
        return <>{fallback}</>
    }

    return <>{children}</>
}

/**
 * Modül erişim kontrolü componenti
 * 
 * @example
 * ```tsx
 * <ModuleGuard role="KANTINCI" module="kantin">
 *   <KantinDashboard />
 * </ModuleGuard>
 * ```
 */
interface ModuleGuardProps {
    role: Role
    module: Module
    children: React.ReactNode
    fallback?: React.ReactNode
}

export function ModuleGuard({
    role,
    module,
    children,
    fallback = null,
}: ModuleGuardProps) {
    if (!hasModuleAccess(role, module)) {
        return <>{fallback}</>
    }

    return <>{children}</>
}
