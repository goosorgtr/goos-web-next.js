'use client'

import * as React from 'react'
import { CreditCard, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface Student {
    id: string
    studentName: string
    studentId: string
    class: string
    balance: string
    avatar?: string
    avatarColor?: string
}

interface AddBalanceDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    student: Student | null
}



export function AddBalanceDialog({ open, onOpenChange, student }: AddBalanceDialogProps) {
    const [amount, setAmount] = React.useState('')
    const [description, setDescription] = React.useState('')

    // Reset form when dialog opens/closes or student changes
    React.useEffect(() => {
        if (open) {
            setAmount('')
            setDescription('Bakiye Yükleme')
        }
    }, [open, student])

    const handleSave = () => {
        // Burada API çağrısı yapılacak
        console.log('Adding balance:', {
            studentId: student?.id,
            amount: parseFloat(amount),
            description
        })
        // İşlem başarılı simülasyonu
        onOpenChange(false)
    }

    if (!student) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Bakiye Yükle</DialogTitle>
                    <DialogDescription>
                        Öğrenci hesabına para yükleme işlemi yapın.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Öğrenci Bilgisi (Kart Görünümü) */}
                    <div className="flex items-center gap-4 rounded-lg border bg-blue-50/50 p-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white ${student.avatarColor || 'bg-gray-500'}`}>
                            {student.avatar || student.studentName.charAt(0)}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{student.studentName}</h4>
                            <p className="text-sm text-muted-foreground">{student.class} • #{student.studentId}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-muted-foreground">Mevcut Bakiye</p>
                            <p className="font-bold text-blue-600">{student.balance}</p>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {/* Tutar */}
                        <div className="space-y-2">
                            <Label htmlFor="amount">Yüklenecek Tutar (₺)</Label>
                            <div className="relative">
                                <Wallet className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="amount"
                                    placeholder="0.00"
                                    className="pl-10 text-lg font-semibold"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                        </div>



                        {/* Açıklama */}
                        <div className="space-y-2">
                            <Label htmlFor="desc">Açıklama</Label>
                            <Input
                                id="desc"
                                placeholder="İşlem açıklaması"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>İptal</Button>
                    <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Bakiye Yükle
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
