export interface ClassItem {
    id: string;
    name: string;
    grade: number;
    isActive: boolean;
    updatedAt?: string;
    studentCount?: number;
}

export interface CreateClassDto {
    name: string;
    grade: number;
    isActive?: boolean;
}

export interface UpdateClassDto extends Partial<CreateClassDto> {
    isActive?: boolean;
}

export interface StudentInClass {
    id: string;
    studentId: string;
    userId: string;
    studentNo: string;
    firstName: string;
    lastName: string;
    classId: string;
}

export interface StudentForAssignment {
    id: string;
    userId: string;
    studentNo: string;
    firstName: string;
    lastName: string;
    currentClassId?: string;
    currentClassName?: string;
}

