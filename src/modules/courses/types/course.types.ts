export interface Course {
    id: string;
    name: string;
    isActive: boolean;
    updatedAt?: string;
}

export interface CreateCourseDto {
    name: string;
    isActive?: boolean;
}

export interface UpdateCourseDto extends Partial<CreateCourseDto> {
    isActive?: boolean;
}

