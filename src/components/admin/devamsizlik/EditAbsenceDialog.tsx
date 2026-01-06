'use client'

import * as React from 'react'
import { CalendarIcon, User } from 'lucide-react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale' // Türkçe yerelleştirme için
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'

interface AttendanceRecord {
    id: string
    studentName: string
    studentId: string
    class: string
    date: string // Assuming string format like '24 Kas 2024' or ISO
    status: string
}

interface EditAbsenceDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    record: AttendanceRecord | null
}

const ABSENCE_TYPES = [
    { value: 'full', label: 'Tam Gün - Özürsüz' },
    { value: 'half', label: 'Yarım Gün' },
    { value: 'late', label: 'Geç' },
    { value: 'permitted', label: 'İzinli/Raporlu' },
    { value: 'activity', label: 'Faaliyet' },
]

export function EditAbsenceDialog({ open, onOpenChange, record }: EditAbsenceDialogProps) {
    const [date, setDate] = React.useState<Date | undefined>(new Date())
    const [status, setStatus] = React.useState<string>('')
    const [description, setDescription] = React.useState('')

    // Form açıldığında mevcut verileri doldur
    React.useEffect(() => {
        if (record) {
            // Mock verideki tarihi parse etmeye çalışıyoruz. 
            // Gerçek senaryoda ISO string gelmesi daha sağlıklı olur.
            // Şimdilik '24 Kas 2024' formatını basitçe günümüze eşitliyorum veya parse edilebilir.
            // Demo için new Date() bırakıyorum veya basit parse deniyoruz.
            setDate(new Date())

            // Status mapping needs to be handled if mock data differs from select values
            setStatus(record.status === 'absent' ? 'full' : 'permitted')
            setDescription('')
        }
    }, [record])

    const handleSave = () => {
        // Burada API çağrısı yapılacak
        console.log('Updating absence:', {
            id: record?.id,
            date: date ? format(date, 'yyyy-MM-dd') : null,
            status,
            description
        })
        onOpenChange(false)
    }

    if (!record) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Devamsızlık Düzenle</DialogTitle>
                    <DialogDescription>
                        Öğrenci devamsızlık bilgisini güncelleyin.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Öğrenci Bilgisi (Salt Okunur) */}
                    <div className="rounded-lg bg-gray-50 p-4 border flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                            {record.studentName.charAt(0)}
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900">{record.studentName}</h4>
                            <p className="text-sm text-muted-foreground">{record.studentId} • {record.class}</p>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {/* Tarih Seçimi */}
                        <div className="space-y-2">
                            <Label>Tarih</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={'outline'}
                                        className={cn(
                                            'w-full justify-start text-left font-normal',
                                            !date && 'text-muted-foreground'
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, 'd MMMM yyyy', { locale: tr }) : <span>Tarih seçin</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Devamsızlık Türü (Status) */}
                        <div className="space-y-2">
                            <Label>Devamsızlık Türü</Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Devamsızlık türü seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ABSENCE_TYPES.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Açıklama */}
                        <div className="space-y-2">
                            <Label>Açıklama (Opsiyonel)</Label>
                            <Input
                                placeholder="Devamsızlık nedeni/açıklaması..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>İptal</Button>
                    <Button onClick={handleSave}>Değişiklikleri Kaydet</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
