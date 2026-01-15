// Database Types Generated from SQL Schema
// This file contains TypeScript types for all Supabase tables

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

// ============================================
// ENUMS
// ============================================

export enum AttendanceStatus {
    PRESENT = 'present',
    ABSENT = 'absent',
    LATE = 'late',
    EXCUSED = 'excused'
}

export enum HomeworkStatus {
    PENDING = 'pending',
    SUBMITTED = 'submitted',
    GRADED = 'graded',
    LATE = 'late'
}

export enum AppointmentStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed'
}

export enum ServiceSessionStatus {
    PENDING = 'pending',
    ACTIVE = 'active',
    COMPLETED = 'completed'
}

export enum ServiceAttendanceStatus {
    BOARDED = 'boarded',
    DROPPED = 'dropped',
    ABSENT = 'absent'
}

export enum Gender {
    MALE = 'male',
    FEMALE = 'female'
}

export enum StaffType {
    ADMIN = 'admin',
    CANTEEN = 'canteen',
    SERVICE = 'service',
    OTHER = 'other'
}

export enum OrderStatus {
    PENDING = 'pending',
    PREPARING = 'preparing',
    READY = 'ready',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

export enum PaymentStatus {
    PENDING = 'pending',
    PAID = 'paid',
    OVERDUE = 'overdue',
    CANCELLED = 'cancelled'
}

// ============================================
// TABLE TYPES
// ============================================

export interface User {
    id: string
    roleId: string | null
    email: string | null
    address: string | null
    profileImageUrl: string | null
    dateOfBirth: string | null
    firstName: string | null
    lastName: string | null
    phone: string | null
    gender: Gender | null
    isActive: boolean | null
    createdAt: string | null
    updatedAt: string | null
}

export interface Role {
    id: string
    name: string | null
    isActive: boolean | null
    createdAt: string | null
}

export interface Semester {
    id: string
    name: string | null
    startDate: string | null
    endDate: string | null
    isActive: boolean | null
}

export interface Class {
    id: string
    name: string | null
    grade: number | null
    isActive: boolean | null
    updatedAt: string | null
}

export interface Course {
    id: string
    name: string | null
    isActive: boolean | null
    updatedAt: string | null
}

export interface Student {
    id: string
    userId: string | null
    classId: string | null
    beaconId: string | null
    studentNo: string | null
    updatedAt: string | null
}

export interface Teacher {
    id: string
    userId: string | null
    isActive: boolean | null
    updatedAt: string | null
}

export interface Parent {
    id: string
    userId: string | null
    isActive: boolean | null
    updatedAt: string | null
}

export interface ParentStudent {
    id: string
    parentId: string | null
    studentId: string | null
    isActive: boolean | null
}

export interface Staff {
    id: string
    userId: string | null
    staffType: StaffType | null
    isActive: boolean | null
}

export interface TeacherCourse {
    id: string
    teacherId: string | null
    courseId: string | null
    classId: string | null
    semesterId: string | null
    isActive: boolean | null
}

export interface Homework {
    id: string
    courseId: string | null
    classId: string | null
    teacherId: string | null
    semesterId: string | null
    title: string | null
    description: string | null
    dueDate: string | null
    isActive: boolean | null
    createdBy: string | null
    updatedAt: string | null
}

export interface HomeworkStatusRecord {
    homeworkId: string | null
    studentId: string | null
    status: HomeworkStatus | null
    feedback: string | null
    updatedAt: string | null
}

export interface Attendance {
    id: string
    studentId: string | null
    courseId: string | null
    classId: string | null
    teacherId: string | null
    semesterId: string | null
    date: string | null
    notes: string | null
    status: AttendanceStatus | null
    createdAt: string | null
}

export interface Exam {
    id: string
    courseId: string | null
    classId: string | null
    teacherId: string | null
    semesterId: string | null
    title: string | null
    examDate: string | null
    isActive: boolean | null
    createdBy: string | null
}

export interface ExamResult {
    id: string
    examId: string | null
    studentId: string | null
    semesterId: string | null
    score: number | null
}

export interface Announcement {
    id: string
    title: string | null
    content: string | null
    createdBy: string | null
    semesterId: string | null
    isActive: boolean | null
    createdAt: string | null
}

export interface AnnouncementRole {
    id: string
    announcementId: string | null
    roleId: string | null
}

export interface AnnouncementClass {
    announcementId: string | null
    classId: string | null
}

export interface Event {
    id: string
    title: string | null
    description: string | null
    startDate: string | null
    endDate: string | null
    semesterId: string | null
    createdBy: string | null
    isActive: boolean | null
}

export interface EventRole {
    eventId: string | null
    roleId: string | null
}

export interface EventClass {
    eventId: string | null
    classId: string | null
}

export interface CanteenTransaction {
    id: string
    studentId: string | null
    canteenUserId: string | null
    semesterId: string | null
    amount: number | null
    createdAt: string | null
}

export interface StudentBalance {
    studentId: string
    semesterId: string | null
    balance: number | null
    updatedAt: string | null
}

export interface Vehicle {
    id: string
    plate: string | null
    driverId: string | null
    isActive: boolean | null
}

export interface Route {
    id: string
    name: string | null
    vehicleId: string | null
    isActive: boolean | null
    createdAt: string | null
}

export interface RouteStop {
    id: string
    routeId: string | null
    stopName: string | null
    lat: number | null
    lng: number | null
    stopOrder: number | null
    isActive: boolean | null
}

export interface StudentRouteAssignment {
    id: string
    studentId: string | null
    routeId: string | null
    stopId: string | null
    semesterId: string | null
    isActive: boolean | null
    assignedAt: string | null
}

export interface ServiceSession {
    id: string
    vehicleId: string | null
    startedBy: string | null
    semesterId: string | null
    status: ServiceSessionStatus | null
    startedAt: string | null
    endedAt: string | null
}

export interface ServiceAttendance {
    id: string
    serviceSessionId: string | null
    studentId: string | null
    status: ServiceAttendanceStatus | null
    createdAt: string | null
}

export interface ServiceLocation {
    id: string
    serviceSessionId: string | null
    lat: number | null
    lng: number | null
    createdAt: string | null
}

export interface IBeacon {
    id: string
    uuid: string | null
    major: number | null
    minor: number | null
    isActive: boolean | null
}

export interface BeaconLog {
    id: string
    beaconId: string | null
    studentId: string | null
    detectedBy: string | null
    rssi: number | null
    distance: number | null
    createdAt: string | null
}

export interface SafeZone {
    id: string
    name: string | null
    lat: number | null
    lng: number | null
    radius: number | null
    isActive: boolean | null
}

export interface StudentSafeZone {
    id: string
    studentId: string | null
    safeZoneId: string | null
}

export interface MessageThread {
    id: string
    parentId: string | null
    adminId: string | null
    createdAt: string | null
}

export interface Message {
    id: string
    threadId: string | null
    senderId: string | null
    content: string | null
    createdAt: string | null
}

export interface Notification {
    id: string
    userId: string | null
    type: string | null
    title: string | null
    body: string | null
    payload: Json | null
    isRead: boolean | null
    readAt: string | null
    createdAt: string | null
}

export interface NotificationToken {
    id: string
    userId: string | null
    token: string | null
    platform: string | null
    isActive: boolean | null
}

export interface Appointment {
    id: string
    parentId: string | null
    studentId: string | null
    teacherId: string | null
    appointmentDate: string | null
    status: AppointmentStatus | null
    notes: string | null
    createdAt: string | null
    updatedAt: string | null
}

export interface ClassSchedule {
    id: string
    classId: string | null
    semesterId: string | null
    pdfUrl: string | null
    isActive: boolean | null
    uploadedAt: string | null
}

export interface TeacherSchedule {
    id: string
    teacherId: string | null
    semesterId: string | null
    pdfUrl: string | null
    isActive: boolean | null
    uploadedAt: string | null
}

export interface MealPlan {
    id: string
    semesterId: string | null
    month: number | null
    year: number | null
    pdfUrl: string | null
    isActive: boolean | null
    uploadedBy: string | null
    uploadedAt: string | null
}

export interface CanteenProduct {
    id: string
    name: string | null
    description: string | null
    price: number | null
    categoryId: string | null
    imageUrl: string | null
    stock: number | null
    isAvailable: boolean | null
    isActive: boolean | null
    createdAt: string | null
    updatedAt: string | null
}

export interface CanteenCategory {
    id: string
    name: string | null
    isActive: boolean | null
    createdAt: string | null
}

export interface CanteenOrder {
    id: string
    studentId: string | null
    totalAmount: number | null
    status: string | null
    semesterId: string | null
    createdAt: string | null
    completedAt: string | null
}

export interface CanteenOrderItem {
    id: string
    orderId: string | null
    productId: string | null
    quantity: number | null
    priceAtOrder: number | null
}

export interface Payment {
    id: string
    studentId: string | null
    amount: number | null
    categoryId: string | null
    description: string | null
    dueDate: string | null
    paidDate: string | null
    status: string | null
    semesterId: string | null
    createdAt: string | null
}

export interface PaymentCategory {
    id: string
    name: string | null
    description: string | null
    isActive: boolean | null
    createdAt: string | null
}

export interface Debt {
    id: string
    studentId: string | null
    amount: number | null
    description: string | null
    dueDate: string | null
    status: string | null
    semesterId: string | null
    createdAt: string | null
    updatedAt: string | null
}

export interface PaymentPlan {
    id: string
    studentId: string | null
    totalAmount: number | null
    installments: number | null
    paidInstallments: number | null
    status: string | null
    semesterId: string | null
    createdAt: string | null
    updatedAt: string | null
}

export interface ActivityLog {
    id: string
    userId: string | null
    action: string | null
    entity: string | null
    entityId: string | null
    oldData: Json | null
    newData: Json | null
    createdAt: string | null
}

// ============================================
// DATABASE HELPER TYPES
// ============================================

export interface Database {
    public: {
        Tables: {
            users: {
                Row: User
                Insert: Omit<User, 'id' | 'createdAt' | 'updatedAt'>
                Update: Partial<Omit<User, 'id' | 'createdAt'>>
            }
            roles: {
                Row: Role
                Insert: Omit<Role, 'id' | 'createdAt'>
                Update: Partial<Omit<Role, 'id' | 'createdAt'>>
            }
            semesters: {
                Row: Semester
                Insert: Omit<Semester, 'id'>
                Update: Partial<Omit<Semester, 'id'>>
            }
            classes: {
                Row: Class
                Insert: Omit<Class, 'id' | 'updatedAt'>
                Update: Partial<Omit<Class, 'id'>>
            }
            courses: {
                Row: Course
                Insert: Omit<Course, 'id' | 'updatedAt'>
                Update: Partial<Omit<Course, 'id'>>
            }
            students: {
                Row: Student
                Insert: Omit<Student, 'id' | 'updatedAt'>
                Update: Partial<Omit<Student, 'id'>>
            }
            teachers: {
                Row: Teacher
                Insert: Omit<Teacher, 'id' | 'updatedAt'>
                Update: Partial<Omit<Teacher, 'id'>>
            }
            parents: {
                Row: Parent
                Insert: Omit<Parent, 'id' | 'updatedAt'>
                Update: Partial<Omit<Parent, 'id'>>
            }
            parent_students: {
                Row: ParentStudent
                Insert: Omit<ParentStudent, 'id'>
                Update: Partial<Omit<ParentStudent, 'id'>>
            }
            staff: {
                Row: Staff
                Insert: Omit<Staff, 'id'>
                Update: Partial<Omit<Staff, 'id'>>
            }
            teacher_courses: {
                Row: TeacherCourse
                Insert: Omit<TeacherCourse, 'id'>
                Update: Partial<Omit<TeacherCourse, 'id'>>
            }
            homeworks: {
                Row: Homework
                Insert: Omit<Homework, 'id' | 'updatedAt'>
                Update: Partial<Omit<Homework, 'id'>>
            }
            homework_status: {
                Row: HomeworkStatusRecord
                Insert: HomeworkStatusRecord
                Update: Partial<HomeworkStatusRecord>
            }
            attendance: {
                Row: Attendance
                Insert: Omit<Attendance, 'id' | 'createdAt'>
                Update: Partial<Omit<Attendance, 'id' | 'createdAt'>>
            }
            exams: {
                Row: Exam
                Insert: Omit<Exam, 'id'>
                Update: Partial<Omit<Exam, 'id'>>
            }
            exam_results: {
                Row: ExamResult
                Insert: Omit<ExamResult, 'id'>
                Update: Partial<Omit<ExamResult, 'id'>>
            }
            announcements: {
                Row: Announcement
                Insert: Omit<Announcement, 'id' | 'createdAt'>
                Update: Partial<Omit<Announcement, 'id' | 'createdAt'>>
            }
            announcement_roles: {
                Row: AnnouncementRole
                Insert: Omit<AnnouncementRole, 'id'>
                Update: Partial<Omit<AnnouncementRole, 'id'>>
            }
            announcement_classes: {
                Row: AnnouncementClass
                Insert: AnnouncementClass
                Update: Partial<AnnouncementClass>
            }
            events: {
                Row: Event
                Insert: Omit<Event, 'id'>
                Update: Partial<Omit<Event, 'id'>>
            }
            event_roles: {
                Row: EventRole
                Insert: EventRole
                Update: Partial<EventRole>
            }
            event_classes: {
                Row: EventClass
                Insert: EventClass
                Update: Partial<EventClass>
            }
            canteen_transactions: {
                Row: CanteenTransaction
                Insert: Omit<CanteenTransaction, 'id' | 'createdAt'>
                Update: Partial<Omit<CanteenTransaction, 'id' | 'createdAt'>>
            }
            student_balances: {
                Row: StudentBalance
                Insert: Omit<StudentBalance, 'updatedAt'>
                Update: Partial<Omit<StudentBalance, 'studentId'>>
            }
            vehicles: {
                Row: Vehicle
                Insert: Omit<Vehicle, 'id'>
                Update: Partial<Omit<Vehicle, 'id'>>
            }
            routes: {
                Row: Route
                Insert: Omit<Route, 'id' | 'createdAt'>
                Update: Partial<Omit<Route, 'id' | 'createdAt'>>
            }
            route_stops: {
                Row: RouteStop
                Insert: Omit<RouteStop, 'id'>
                Update: Partial<Omit<RouteStop, 'id'>>
            }
            student_route_assignments: {
                Row: StudentRouteAssignment
                Insert: Omit<StudentRouteAssignment, 'id' | 'assignedAt'>
                Update: Partial<Omit<StudentRouteAssignment, 'id' | 'assignedAt'>>
            }
            service_sessions: {
                Row: ServiceSession
                Insert: Omit<ServiceSession, 'id' | 'startedAt'>
                Update: Partial<Omit<ServiceSession, 'id' | 'startedAt'>>
            }
            service_attendance: {
                Row: ServiceAttendance
                Insert: Omit<ServiceAttendance, 'id' | 'createdAt'>
                Update: Partial<Omit<ServiceAttendance, 'id' | 'createdAt'>>
            }
            service_locations: {
                Row: ServiceLocation
                Insert: Omit<ServiceLocation, 'id' | 'createdAt'>
                Update: Partial<Omit<ServiceLocation, 'id' | 'createdAt'>>
            }
            ibeacons: {
                Row: IBeacon
                Insert: Omit<IBeacon, 'id'>
                Update: Partial<Omit<IBeacon, 'id'>>
            }
            beacon_logs: {
                Row: BeaconLog
                Insert: Omit<BeaconLog, 'id' | 'createdAt'>
                Update: Partial<Omit<BeaconLog, 'id' | 'createdAt'>>
            }
            safe_zones: {
                Row: SafeZone
                Insert: Omit<SafeZone, 'id'>
                Update: Partial<Omit<SafeZone, 'id'>>
            }
            student_safe_zones: {
                Row: StudentSafeZone
                Insert: Omit<StudentSafeZone, 'id'>
                Update: Partial<Omit<StudentSafeZone, 'id'>>
            }
            message_threads: {
                Row: MessageThread
                Insert: Omit<MessageThread, 'id' | 'createdAt'>
                Update: Partial<Omit<MessageThread, 'id' | 'createdAt'>>
            }
            messages: {
                Row: Message
                Insert: Omit<Message, 'id' | 'createdAt'>
                Update: Partial<Omit<Message, 'id' | 'createdAt'>>
            }
            notifications: {
                Row: Notification
                Insert: Omit<Notification, 'id' | 'createdAt'>
                Update: Partial<Omit<Notification, 'id' | 'createdAt'>>
            }
            notification_tokens: {
                Row: NotificationToken
                Insert: Omit<NotificationToken, 'id'>
                Update: Partial<Omit<NotificationToken, 'id'>>
            }
            appointments: {
                Row: Appointment
                Insert: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>
                Update: Partial<Omit<Appointment, 'id' | 'createdAt'>>
            }
            class_schedules: {
                Row: ClassSchedule
                Insert: Omit<ClassSchedule, 'id' | 'uploadedAt'>
                Update: Partial<Omit<ClassSchedule, 'id' | 'uploadedAt'>>
            }
            teacher_schedules: {
                Row: TeacherSchedule
                Insert: Omit<TeacherSchedule, 'id' | 'uploadedAt'>
                Update: Partial<Omit<TeacherSchedule, 'id' | 'uploadedAt'>>
            }
            meal_plans: {
                Row: MealPlan
                Insert: Omit<MealPlan, 'id' | 'uploadedAt'>
                Update: Partial<Omit<MealPlan, 'id' | 'uploadedAt'>>
            }
            canteen_products: {
                Row: CanteenProduct
                Insert: Omit<CanteenProduct, 'id' | 'createdAt' | 'updatedAt'>
                Update: Partial<Omit<CanteenProduct, 'id' | 'createdAt'>>
            }
            canteen_categories: {
                Row: CanteenCategory
                Insert: Omit<CanteenCategory, 'id' | 'createdAt'>
                Update: Partial<Omit<CanteenCategory, 'id' | 'createdAt'>>
            }
            canteen_orders: {
                Row: CanteenOrder
                Insert: Omit<CanteenOrder, 'id' | 'createdAt'>
                Update: Partial<Omit<CanteenOrder, 'id' | 'createdAt'>>
            }
            canteen_order_items: {
                Row: CanteenOrderItem
                Insert: Omit<CanteenOrderItem, 'id'>
                Update: Partial<Omit<CanteenOrderItem, 'id'>>
            }
            payments: {
                Row: Payment
                Insert: Omit<Payment, 'id' | 'createdAt'>
                Update: Partial<Omit<Payment, 'id' | 'createdAt'>>
            }
            payment_categories: {
                Row: PaymentCategory
                Insert: Omit<PaymentCategory, 'id' | 'createdAt'>
                Update: Partial<Omit<PaymentCategory, 'id' | 'createdAt'>>
            }
            debts: {
                Row: Debt
                Insert: Omit<Debt, 'id' | 'createdAt' | 'updatedAt'>
                Update: Partial<Omit<Debt, 'id' | 'createdAt'>>
            }
            payment_plans: {
                Row: PaymentPlan
                Insert: Omit<PaymentPlan, 'id' | 'createdAt' | 'updatedAt'>
                Update: Partial<Omit<PaymentPlan, 'id' | 'createdAt'>>
            }
            activity_logs: {
                Row: ActivityLog
                Insert: Omit<ActivityLog, 'id' | 'createdAt'>
                Update: Partial<Omit<ActivityLog, 'id' | 'createdAt'>>
            }
        }
        Views: {}
        Functions: {}
        Enums: {
            attendance_status: AttendanceStatus
            homework_status: HomeworkStatus
            appointment_status: AppointmentStatus
            service_session_status: ServiceSessionStatus
            service_attendance_status: ServiceAttendanceStatus
            gender: Gender
            staff_type: StaffType
            order_status: OrderStatus
            payment_status: PaymentStatus
        }
    }
}

// Helper type to get table names
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']

// Helper type to get insert types
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']

// Helper type to get update types
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
