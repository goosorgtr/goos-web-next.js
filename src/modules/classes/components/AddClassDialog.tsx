'use client'

import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Plus, X } from 'lucide-react'
import type { CreateClassDto } from '../types'

const GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

interface AddClassDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: CreateClassDto) => void
    isLoading?: boolean
}

export function AddClassDialog({ open, onOpenChange, onSubmit, isLoading }: AddClassDialogProps) {
    const [selectedGrade, setSelectedGrade] = useState<number | null>(null)
    const [sectionInput, setSectionInput] = useState('')
    const [selectedSections, setSelectedSections] = useState<Record<number, string[]>>({})
    const inputRef = useRef<HTMLInputElement>(null)

    const handleGradeClick = (grade: number) => {
        setSelectedGrade(grade)
        setSectionInput('')
        setTimeout(() => inputRef.current?.focus(), 100)
    }

    const addSection = (grade: number, section: string) => {
        const trimmed = section.trim().toUpperCase()
        if (!trimmed) return
        
        setSelectedSections(prev => {
            const current = prev[grade] || []
            if (current.includes(trimmed)) return prev
            return { ...prev, [grade]: [...current, trimmed] }
        })
        setSectionInput('')
    }

    const removeSection = (grade: number, section: string) => {
        setSelectedSections(prev => {
            const current = prev[grade] || []
            return { ...prev, [grade]: current.filter(s => s !== section) }
        })
    }

    const handleKeyDown = (e: React.KeyboardEvent, grade: number) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addSection(grade, sectionInput)
        }
    }

    const getSelectedClasses = () => {
        const classes: { grade: number; name: string }[] = []
        Object.entries(selectedSections).forEach(([grade, sections]) => {
            sections.forEach(section => {
                classes.push({
                    grade: parseInt(grade),
                    name: `${grade}-${section}`
                })
            })
        })
        return classes.sort((a, b) => a.grade - b.grade || a.name.localeCompare(b.name))
    }

    const handleSubmit = async () => {
        const classes = getSelectedClasses()
        for (const cls of classes) {
            onSubmit({ name: cls.name, grade: cls.grade, isActive: true })
        }
        setSelectedGrade(null)
        setSelectedSections({})
        setSectionInput('')
    }

    const selectedClasses = getSelectedClasses()

    return (
        <Dialog open={open} onOpenChange={(open) => {
            if (!open) {
                setSelectedGrade(null)
                setSelectedSections({})
                setSectionInput('')
            }
            onOpenChange(open)
        }}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Yeni Sınıf Ekle</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-6">
                    {/* Sol: Seviye ve Şube Girişi */}
                    <div className="space-y-4">
                        <p className="text-sm font-medium text-muted-foreground">Seviye seçin, şube adı yazın</p>
                        <div className="space-y-2 max-h-[400px] overflow-y-auto">
                            {GRADES.map((grade) => (
                                <div key={grade} className="border rounded-lg overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={() => handleGradeClick(grade)}
                                        className={`w-full px-4 py-3 text-left font-medium flex items-center justify-between transition-colors ${
                                            selectedGrade === grade 
                                                ? 'bg-primary text-primary-foreground' 
                                                : 'hover:bg-gray-50'
                                        }`}
                                    >
                                        <span>{grade}. Sınıf</span>
                                        {(selectedSections[grade]?.length || 0) > 0 && (
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                                                selectedGrade === grade 
                                                    ? 'bg-white/20' 
                                                    : 'bg-primary/10 text-primary'
                                            }`}>
                                                {selectedSections[grade].length} şube
                                            </span>
                                        )}
                                    </button>
                                    
                                    {selectedGrade === grade && (
                                        <div className="p-3 bg-gray-50 border-t space-y-3">
                                            {/* Input */}
                                            <div className="flex gap-2">
<Input
                                                      ref={inputRef}
                                                     placeholder="Şube adı (Enter ile ekle)"
                                                      value={sectionInput}
                                                      onChange={(e) => setSectionInput(e.target.value)}
                                                    onKeyDown={(e) => handleKeyDown(e, grade)}
                                                    className="flex-1"
                                                />
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    onClick={() => addSection(grade, sectionInput)}
                                                    disabled={!sectionInput.trim()}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            
                                            {/* Eklenen şubeler */}
                                            {(selectedSections[grade]?.length || 0) > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {selectedSections[grade].map((section) => (
                                                        <span
                                                            key={section}
                                                            className="inline-flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-medium"
                                                        >
                                                            {grade}-{section}
                                                            <button
                                                                type="button"
                                                                onClick={() => removeSection(grade, section)}
                                                                className="hover:bg-white/20 rounded p-0.5"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sağ: Seçilen Sınıflar */}
                    <div className="space-y-4">
                        <p className="text-sm font-medium text-muted-foreground">
                            Eklenecek Sınıflar ({selectedClasses.length})
                        </p>
                        <div className="border rounded-lg p-4 min-h-[400px] max-h-[400px] overflow-y-auto bg-gray-50">
                            {selectedClasses.length === 0 ? (
                                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                    Henüz sınıf eklenmedi
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {selectedClasses.map((cls) => (
                                        <span
                                            key={cls.name}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                                        >
                                            {cls.name}
                                            <button
                                                type="button"
                                                onClick={() => removeSection(cls.grade, cls.name.split('-')[1])}
                                                className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        İptal
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        disabled={selectedClasses.length === 0 || isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Ekleniyor...
                            </>
                        ) : (
                            `${selectedClasses.length} Sınıf Ekle`
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
