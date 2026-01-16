'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Loader2 } from 'lucide-react'

interface DeleteDonemDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    donemName: string
    onConfirm: () => void
    isLoading?: boolean
}

export function DeleteDonemDialog({ open, onOpenChange, donemName, onConfirm, isLoading }: DeleteDonemDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <DialogTitle>Dönem Sil</DialogTitle>
                            <DialogDescription className="mt-1">
                                Bu işlem geri alınamaz.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="py-4">
                    <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">&quot;{donemName}&quot;</span> dönemini silmek istediğinizden emin misiniz?
                    </p>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        İptal
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => {
                            onConfirm()
                        }}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Siliniyor...
                            </>
                        ) : (
                            'Sil'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

