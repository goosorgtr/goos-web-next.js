'use client'

import { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface EditGradeDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    grade: any
    onSave: (gradeId: string, newScore: number | null) => void
}

export function EditGradeDialog({ open, onOpenChange, grade, onSave }: EditGradeDialogProps) {
    const [score, setScore] = useState<string>('')

    useEffect(() => {
        if (grade) {
            setScore(grade.score !== null ? grade.score.toString() : '')
        }
    }, [grade])

    const handleSave = () => {
        const numScore = score === '' ? null : Number(score)
        if (grade) {
            onSave(grade.id, numScore)
        }
        onOpenChange(false)
    }

    if (!grade) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Not Düzenle</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Summary Info */}
                    <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-900">
                        <span className="font-semibold">{grade.studentName}</span> isimli öğrencinin
                        <span className="font-semibold"> {grade.subject}</span> dersi
                        <span className="font-semibold"> {grade.assessment}</span> notunu düzenliyorsunuz.
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="score">Puan (Max: {grade.maxScore})</Label>
                        <Input
                            id="score"
                            type="number"
                            value={score}
                            onChange={(e) => setScore(e.target.value)}
                            placeholder="Puan giriniz"
                            max={grade.maxScore}
                            min={0}
                        />
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
