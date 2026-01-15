'use client'

import { Search, UserMinus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { StudentInClass } from '../types'

interface ClassStudentsListProps {
    students: StudentInClass[]
    isLoading: boolean
    onRemoveStudent: (studentId: string) => void
    isRemoving: boolean
    searchQuery: string
}

export function ClassStudentsList({ 
    students, 
    isLoading, 
    onRemoveStudent, 
    isRemoving,
    searchQuery 
}: ClassStudentsListProps) {
    const filteredStudents = students.filter((student) => {
        const searchLower = searchQuery.toLowerCase()
        const fullName = `${student.firstName} ${student.lastName}`.toLowerCase()
        return searchQuery === '' || 
            fullName.includes(searchLower) || 
            student.studentNo.toLowerCase().includes(searchLower)
    })

    if (isLoading) {
        return (
            <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
                            <div className="space-y-1">
                                <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                                <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
                            </div>
                        </div>
                        <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />
                    </div>
                ))}
            </div>
        )
    }

    if (filteredStudents.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-sm font-medium text-muted-foreground">
                    {searchQuery ? 'Arama kriterlerine uygun öğrenci bulunamadı' : 'Bu sınıfta henüz öğrenci yok'}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                    {!searchQuery && 'Yukarıdaki "Öğrenci Ekle" butonunu kullanarak öğrenci ekleyebilirsiniz'}
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            {filteredStudents.map((student) => (
                <div
                    key={student.id}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                            {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-medium">
                                {student.firstName} {student.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                No: {student.studentNo}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRemoveStudent(student.studentId)}
                        disabled={isRemoving}
                        className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        {isRemoving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <UserMinus className="h-4 w-4" />
                        )}
                        Çıkar
                    </Button>
                </div>
            ))}
        </div>
    )
}

