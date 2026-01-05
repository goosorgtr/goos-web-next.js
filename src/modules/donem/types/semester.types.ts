export interface Donem {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
}

export interface CreateDonemDto {
    name: string;
    startDate: string;
    endDate: string;
    isActive?: boolean;
}

export interface UpdateDonemDto extends Partial<CreateDonemDto> {
    isActive?: boolean;
}
