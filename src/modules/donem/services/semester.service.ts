import api from '@/lib/api/client';
import type { Donem, CreateDonemDto, UpdateDonemDto } from '../types';

const MOCK_SEMESTERS: Donem[] = [
    {
        id: '1',
        name: '2024 ve 2025 Eğitim Öğretim Yılı 2.Dönem',
        startDate: '2025-02-05',
        endDate: '2026-06-12',
        isActive: false
    },
    {
        id: '2',
        name: '2024 ve 2025 Eğitim Öğretim Yılı 1.Dönem',
        startDate: '2024-09-11',
        endDate: '2025-01-19',
        isActive: false
    },
    {
        id: '3',
        name: '2023 ve 2024 Yaz Okulu',
        startDate: '2024-07-01',
        endDate: '2024-08-30',
        isActive: true
    }
];

export const semesterService = {
    async getAll(): Promise<Donem[]> {
        try {
            const { data } = await api.get('/semesters');
            return data;
        } catch (error) {
            console.warn('API error, using mock data for semesters');
            return MOCK_SEMESTERS;
        }
    },

    async getById(id: string): Promise<Donem> {
        try {
            const { data } = await api.get(`/semesters/${id}`);
            return data;
        } catch (error) {
            console.warn('API error, using mock data for semester');
            const semester = MOCK_SEMESTERS.find(s => s.id === id);
            if (!semester) {
                throw new Error('Semester not found');
            }
            return semester;
        }
    },

    async create(dto: CreateDonemDto): Promise<Donem> {
        const { data } = await api.post('/semesters', dto);
        return data;
    },

    async update(id: string, dto: UpdateDonemDto): Promise<Donem> {
        const { data } = await api.put(`/semesters/${id}`, dto);
        return data;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/semesters/${id}`);
    },

    async toggleActive(id: string): Promise<Donem> {
        const { data } = await api.patch(`/semesters/${id}/toggle-active`);
        return data;
    }
};
