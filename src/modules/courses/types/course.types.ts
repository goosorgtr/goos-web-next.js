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

// Teacher Course (Öğretmen-Ders Ataması)
export interface TeacherCourse {
    id: string;
    teacherId: string;
    courseId: string;
    classId: string | null;
    semesterId: string | null;
    isActive: boolean;
    // İlişkili veriler
    teacher?: {
        id: string;
        firstName: string;
        lastName: string;
    };
    course?: {
        id: string;
        name: string;
    };
    class?: {
        id: string;
        name: string;
        grade: number;
    };
    semester?: {
        id: string;
        name: string;
    };
}

export interface CreateTeacherCourseDto {
    teacherId: string;
    courseId: string;
    classId?: string | null;
    semesterId?: string | null;
    isActive?: boolean;
}

export interface UpdateTeacherCourseDto {
    teacherId?: string;
    courseId?: string;
    classId?: string | null;
    semesterId?: string | null;
    isActive?: boolean;
}

