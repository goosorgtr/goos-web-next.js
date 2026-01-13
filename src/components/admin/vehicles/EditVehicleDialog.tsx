'use client'

import * as React from 'react'
import { Car, Check, Users } from 'lucide-react'
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

interface EditVehicleDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    vehicle: any
    onSave: (updatedVehicle: any) => void
    onManageStudents: (plate: string) => void
}

export function EditVehicleDialog({ open, onOpenChange, vehicle, onSave, onManageStudents }: EditVehicleDialogProps) {
    const [plate, setPlate] = React.useState('')
    const [brand, setBrand] = React.useState('')

    React.useEffect(() => {
        if (vehicle) {
            setPlate(vehicle.plate)
            setBrand(vehicle.model)
        }
    }, [vehicle])

    const handleSave = () => {
        onSave({ ...vehicle, plate, model: brand })
        onOpenChange(false)
    }

    if (!vehicle) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Aracı Düzenle</DialogTitle>
                    <DialogDescription>
                        Araç bilgilerini güncelleyin veya öğrencileri yönetin.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-plate">Araç Plakası</Label>
                        <div className="relative">
                            <Car className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="edit-plate"
                                placeholder="34 ABC 123"
                                className="pl-10 uppercase"
                                value={plate}
                                onChange={(e) => setPlate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-brand">Araç Marka/Model</Label>
                        <Input
                            id="edit-brand"
                            placeholder="Örn: Ford Transit"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                        />
                    </div>

                    <div className="pt-2">
                        <Button
                            variant="outline"
                            className="w-full justify-start gap-2 h-12 border-dashed border-2 hover:border-primary hover:text-primary transition-all"
                            onClick={() => {
                                onOpenChange(false)
                                onManageStudents(plate)
                            }}
                        >
                            <Users className="h-5 w-5" />
                            <span>Bu Araçtaki Öğrencileri Yönet</span>
                        </Button>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>İptal</Button>
                    <Button onClick={handleSave} disabled={!plate || !brand}>
                        <Check className="mr-2 h-4 w-4" />
                        Güncelle
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
