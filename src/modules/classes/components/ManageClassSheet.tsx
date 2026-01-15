'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, UserPlus, Users } from 'lucide-react'
import { useClassStudents } from '../hooks/useClassStudents'
import { ClassStudentsList } from './ClassStudentsList'
import { AddStudentToClassDialog } from './AddStudentToClassDialog'
import type { ClassItem } from '../types'

interface ManageClassSheetProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    classItem: ClassItem | null
}

export function ManageClassSheet({ open, onOpenChange, classItem }: ManageClassSheetProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [showAddDialog, setShowAddDialog] = useState(false)

    const {
        students,
        availableStudents,
        isLoading,
        isLoadingAvailable,
        addStudent,
        removeStudent,
        isAdding,
        isRemoving
    } = useClassStudents(classItem?.id ?? null)

    if (!classItem) return null

    return (
        <>
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className="w-full sm:max-w-lg flex flex-col">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            {classItem.name} Sınıfı
                        </SheetTitle>
                    </SheetHeader>

                    <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                        {/* Üst Kısım: Arama ve Ekle Butonu */}
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Öğrenci ara..."
                                    className="pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button onClick={() => setShowAddDialog(true)} className="gap-2">
                                <UserPlus className="h-4 w-4" />
                                Öğrenci Ekle
                            </Button>
                        </div>

                        {/* Öğrenci Listesi */}
                        <div className="flex-1 overflow-y-auto">
                            <ClassStudentsList
                                students={students}
                                isLoading={isLoading}
                                onRemoveStudent={removeStudent}
                                isRemoving={isRemoving}
                                searchQuery={searchQuery}
                            />
                        </div>

                        {/* Alt Bilgi */}
                        <div className="border-t pt-4">
                            <p className="text-sm text-muted-foreground">
                                Toplam <span className="font-medium">{students.length}</span> öğrenci
                            </p>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            <AddStudentToClassDialog
                open={showAddDialog}
                onOpenChange={setShowAddDialog}
                availableStudents={availableStudents}
                currentClassId={classItem.id}
                onAddStudent={addStudent}
                isLoading={isLoadingAvailable}
                isAdding={isAdding}
            />
        </>
    )
}

