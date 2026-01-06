'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { cn } from '@/lib/utils'

interface AddAbsenceDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const CLASSES = ['9. Sınıf', '10. Sınıf', '11. Sınıf', '12. Sınıf']
const BRANCHES = ['A', 'B', 'C', 'D', 'E', 'F']
const STUDENTS = [
    { id: '1', name: 'Ahmet Yılmaz', number: '2024045' },
    { id: '2', name: 'Ayşe Kaya', number: '2024115' },
    { id: '3', name: 'Mehmet Çelik', number: '2024189' },
]
const ABSENCE_TYPES = ['Yok', 'Geç', 'İzinli', 'Raporlu']

export function AddAbsenceDialog({ open, onOpenChange }: AddAbsenceDialogProps) {
    const [selectedClass, setSelectedClass] = useState('')
    const [selectedBranch, setSelectedBranch] = useState('')
    const [selectedStudent, setSelectedStudent] = useState('')
    const [selectedType, setSelectedType] = useState('')
    const [date, setDate] = useState<Date>()

    const handleSave = () => {
        // In a real app, validation and API call here
        console.log({ selectedClass, selectedBranch, selectedStudent, selectedType, date })
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Devamsızlık Ekle</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Sınıf Seçimi */}
                    <div className="space-y-2">
                        <Label>Sınıf</Label>
                        <Select onValueChange={setSelectedClass}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sınıf seçiniz" />
                            </SelectTrigger>
                            <SelectContent>
                                {CLASSES.map((cls) => (
                                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Şube Seçimi */}
                    <div className="space-y-2">
                        <Label>Şube</Label>
                        <Select onValueChange={setSelectedBranch} disabled={!selectedClass}>
                            <SelectTrigger>
                                <SelectValue placeholder="Şube seçiniz" />
                            </SelectTrigger>
                            <SelectContent>
                                {BRANCHES.map((branch) => (
                                    <SelectItem key={branch} value={branch}>{branch} Şubesi</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Öğrenci Seçimi */}
                    <div className="space-y-2">
                        <Label>Öğrenci</Label>
                        <Select onValueChange={setSelectedStudent} disabled={!selectedBranch}>
                            <SelectTrigger>
                                <SelectValue placeholder="Öğrenci seçiniz" />
                            </SelectTrigger>
                            <SelectContent>
                                {STUDENTS.map(student => (
                                    <SelectItem key={student.id} value={student.id}>
                                        {student.number} - {student.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Tarih Seçimi */}
                    <div className="space-y-2">
                        <Label>Tarih</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP", { locale: tr }) : <span>Tarih seçiniz</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Devamsızlık Türü */}
                    <div className="space-y-2">
                        <Label>Durum</Label>
                        <Select onValueChange={setSelectedType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Durum seçiniz" />
                            </SelectTrigger>
                            <SelectContent>
                                {ABSENCE_TYPES.map(type => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        İptal
                    </Button>
                    <Button onClick={handleSave}>
                        Kaydet
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
