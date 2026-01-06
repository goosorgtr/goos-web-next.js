import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

interface GradeDetailDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    grade: any // Using any for simplicity as types are not strictly shared yet, ideally should be defined
}

export function GradeDetailDialog({ open, onOpenChange, grade }: GradeDetailDialogProps) {
    if (!grade) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Not Detayı</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex items-center gap-4 rounded-lg border p-4 bg-gray-50">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${grade.avatarColor} text-lg font-bold text-white`}>
                            {grade.avatar}
                        </div>
                        <div>
                            <p className="font-semibold text-lg">{grade.studentName}</p>
                            <p className="text-sm text-muted-foreground">{grade.studentId}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground uppercase">Sınıf</Label>
                            <p className="font-medium">{grade.class}</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground uppercase">Branş</Label>
                            <p className="font-medium">{grade.subject}</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground uppercase">Değerlendirme</Label>
                            <p className="font-medium">{grade.assessment}</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground uppercase">Puan</Label>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-primary">
                                    {grade.score !== null ? grade.score : '-'}
                                </span>
                                <span className="text-sm text-muted-foreground">/ {grade.maxScore}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
