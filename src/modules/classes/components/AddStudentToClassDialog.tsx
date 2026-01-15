'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, UserPlus, Loader2 } from 'lucide-react'
import type { StudentForAssignment } from '../types'

interface AddStudentToClassDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    availableStudents: StudentForAssignment[]
    currentClassId: string
    onAddStudent: (params: { studentId: string; classId: string }) => void
    isLoading: boolean
    isAdding: boolean
}

export function AddStudentToClassDialog({
    open,
    onOpenChange,
    availableStudents,
    currentClassId,
    onAddStudent,
    isLoading,
    isAdding
}: AddStudentToClassDialogProps) {
    const [searchQuery, setSearchQuery] = useState('')

    // Mevcut sınıfta olmayan öğrencileri filtrele
    const filteredStudents = availableStudents
        .filter((student) => student.currentClassId !== currentClassId)
        .filter((student) => {
            const searchLower = searchQuery.toLowerCase()
            const fullName = `${student.firstName} ${student.lastName}`.toLowerCase()
            return searchQuery === '' ||
                fullName.includes(searchLower) ||
                student.studentNo.toLowerCase().includes(searchLower)
        })

    const handleAddStudent = (studentId: string) => {
        onAddStudent({ studentId, classId: currentClassId })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Öğrenci Ekle</DialogTitle>
                </DialogHeader>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Öğrenci adı veya numarası ile ara..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 max-h-[400px]">
                    {isLoading ? (
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
                                </div>
                            ))}
                        </div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Search className="h-12 w-12 text-muted-foreground/50" />
                            <p className="mt-4 text-sm font-medium text-muted-foreground">
                                Eklenebilecek öğrenci bulunamadı
                            </p>
                        </div>
                    ) : (
                        filteredStudents.map((student) => (
                            <div
                                key={student.id}
                                className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 font-medium">
                                        {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">
                                            {student.firstName} {student.lastName}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            No: {student.studentNo}
                                            {student.currentClassName && (
                                                <span className="ml-2 text-orange-600">
                                                    (Mevcut: {student.currentClassName})
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    onClick={() => handleAddStudent(student.id)}
                                    disabled={isAdding}
                                    className="gap-1"
                                >
                                    {isAdding ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <UserPlus className="h-4 w-4" />
                                    )}
                                    Ekle
                                </Button>
                            </div>
                        ))
                    )}
                </div>

                <div className="border-t pt-4">
                    <p className="text-xs text-muted-foreground">
                        {filteredStudents.length} öğrenci listeleniyor
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}

