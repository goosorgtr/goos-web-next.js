'use client'

import * as React from 'react'
import { Search, UserPlus, Check, LifeBuoy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Checkbox } from '../../ui/checkbox'

interface AssignStudentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    vehiclePlate: string
    initialSelected?: string[]
    onSave?: (selectedIds: string[]) => void
}

const MOCK_STUDENTS = [
    { id: '1', name: 'Ali Yılmaz', class: '9-A', no: '101', avatar: 'AY', color: 'bg-blue-500' },
    { id: '2', name: 'Ayşe Demir', class: '10-B', no: '245', avatar: 'AD', color: 'bg-pink-500' },
    { id: '3', name: 'Mehmet Kaya', class: '11-C', no: '390', avatar: 'MK', color: 'bg-green-500' },
    { id: '4', name: 'Zeynep Çelik', class: '9-A', no: '102', avatar: 'ZÇ', color: 'bg-purple-500' },
    { id: '5', name: 'Can Yıldız', class: '12-A', no: '555', avatar: 'CY', color: 'bg-orange-500' },
]

export function AssignStudentDialog({ open, onOpenChange, vehiclePlate, initialSelected = [], onSave }: AssignStudentDialogProps) {
    const [searchQuery, setSearchQuery] = React.useState('')
    const [selectedStudents, setSelectedStudents] = React.useState<string[]>(initialSelected)

    React.useEffect(() => {
        if (open) {
            setSelectedStudents(initialSelected)
        }
    }, [open, initialSelected])

    const filteredStudents = MOCK_STUDENTS.filter(
        (s) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.no.includes(searchQuery)
    )

    const toggleStudent = (id: string) => {
        setSelectedStudents((prev) =>
            prev.includes(id)
                ? prev.filter((sId) => sId !== id)
                : [...prev, id]
        )
    }

    const handleSave = () => {
        console.log('Assigning students to vehicle ' + vehiclePlate, selectedStudents)
        if (onSave) onSave(selectedStudents)
        onOpenChange(false)
        if (!onSave) setSelectedStudents([])
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <LifeBuoy className="h-6 w-6 text-primary animate-spin-slow" />
                        <span>Öğrenci Ata - <span className="text-primary">{vehiclePlate}</span></span>
                    </DialogTitle>
                    <DialogDescription>
                        Bu servise atanacak öğrencileri listeden seçiniz.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Arama */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Öğrenci adı veya no ile ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 h-11 focus-visible:ring-primary border-gray-200"
                        />
                    </div>

                    {/* Liste */}
                    <div className="max-h-[350px] overflow-y-auto rounded-xl border border-gray-100 bg-gray-50/30 p-1 custom-scrollbar">
                        {filteredStudents.length > 0 ? (
                            <div className="space-y-1">
                                {filteredStudents.map((student) => {
                                    const isSelected = selectedStudents.includes(student.id);
                                    return (
                                        <div
                                            key={student.id}
                                            className={`flex items-center space-x-3 p-3 rounded-lg transition-all cursor-pointer border ${isSelected
                                                ? 'bg-primary/5 border-primary/20 shadow-sm'
                                                : 'bg-white border-transparent hover:border-gray-200 hover:shadow-sm'
                                                }`}
                                            onClick={() => toggleStudent(student.id)}
                                        >
                                            <Checkbox
                                                id={`student-${student.id}`}
                                                checked={isSelected}
                                                onCheckedChange={() => toggleStudent(student.id)}
                                                className="data-[state=checked]:bg-primary"
                                            />

                                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm ${student.color}`}>
                                                {student.avatar}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <label
                                                    htmlFor={`student-${student.id}`}
                                                    className="block text-sm font-semibold truncate cursor-pointer text-gray-700"
                                                >
                                                    {student.name}
                                                </label>
                                                <p className="text-xs text-muted-foreground font-medium">
                                                    {student.class} • No: {student.no}
                                                </p>
                                            </div>

                                            {isSelected && (
                                                <div className="bg-primary/10 p-1.5 rounded-full">
                                                    <Check className="h-3 w-3 text-primary stroke-[3px]" />
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="p-10 text-center">
                                <Search className="h-10 w-10 text-gray-200 mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground">Öğrenci bulunamadı.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <Button variant="ghost" onClick={() => onOpenChange(false)} className="hover:bg-gray-100">İptal</Button>
                    <Button onClick={handleSave} className="gap-2 bg-primary hover:bg-primary/90 px-6 font-semibold shadow-md active:scale-95 transition-all">
                        <UserPlus className="h-4 w-4" />
                        Kaydet ({selectedStudents.length})
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
