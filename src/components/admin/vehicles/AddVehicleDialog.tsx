'use client'

import * as React from 'react'
import { Car, Check } from 'lucide-react'
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

interface AddVehicleDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave: (newVehicle: any) => void
}

export function AddVehicleDialog({ open, onOpenChange, onSave }: AddVehicleDialogProps) {
    const [plate, setPlate] = React.useState('')
    const [brand, setBrand] = React.useState('')

    const handleSave = () => {
        // API call simulation
        const newVehicle = {
            id: Date.now().toString(),
            plate: plate.toUpperCase(),
            model: brand,
            capacity: 16,
            driver: 'Yeni Şoför',
            status: 'active'
        }
        onSave(newVehicle)
        onOpenChange(false)
        setPlate('')
        setBrand('')
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Yeni Araç Ekle</DialogTitle>
                    <DialogDescription>
                        Yeni bir servis aracı tanımlamak için bilgileri giriniz.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="plate">Araç Plakası</Label>
                        <div className="relative">
                            <Car className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="plate"
                                placeholder="34 ABC 123"
                                className="pl-10 uppercase"
                                value={plate}
                                onChange={(e) => setPlate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="brand">Araç Marka/Model</Label>
                        <Input
                            id="brand"
                            placeholder="Örn: Ford Transit"
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>İptal</Button>
                    <Button onClick={handleSave} disabled={!plate || !brand}>
                        <Check className="mr-2 h-4 w-4" />
                        Kaydet
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
