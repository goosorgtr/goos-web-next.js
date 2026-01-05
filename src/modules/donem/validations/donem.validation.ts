import { z } from 'zod';

export const donemSchema = z.object({
    name: z.string().min(1, 'Dönem adı zorunludur'),
    startDate: z.string().min(1, 'Başlangıç tarihi zorunludur'),
    endDate: z.string().min(1, 'Bitiş tarihi zorunludur'),
    isActive: z.boolean().optional().default(false)
}).refine((data) => {
    // Validate that end date is after start date
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return end > start;
}, {
    message: 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır',
    path: ['endDate']
});

export type DonemFormData = z.infer<typeof donemSchema>;
