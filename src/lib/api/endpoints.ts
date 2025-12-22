// API Endpoints
const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/change-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // User endpoints
  USERS: {
    LIST: '/users',
    GET: (id: string) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    UPDATE_PROFILE: '/users/profile',
  },

  // Ödev (Homework) endpoints
  ODEV: {
    LIST: '/odev',
    GET: (id: string) => `/odev/${id}`,
    CREATE: '/odev',
    UPDATE: (id: string) => `/odev/${id}`,
    DELETE: (id: string) => `/odev/${id}`,
    SUBMIT: (id: string) => `/odev/${id}/submit`,
    GRADE: (id: string) => `/odev/${id}/grade`,
  },

  // Mesaj (Messages) endpoints
  MESAJ: {
    LIST: '/mesaj',
    GET: (id: string) => `/mesaj/${id}`,
    SEND: '/mesaj',
    DELETE: (id: string) => `/mesaj/${id}`,
    MARK_READ: (id: string) => `/mesaj/${id}/read`,
    CONVERSATIONS: '/mesaj/conversations',
  },

  // Konum (Location) endpoints
  KONUM: {
    GET_CURRENT: '/konum/current',
    UPDATE: '/konum/update',
    HISTORY: '/konum/history',
    TRACK: (userId: string) => `/konum/track/${userId}`,
  },

  // Servis (Transport) endpoints
  SERVIS: {
    LIST: '/servis',
    GET: (id: string) => `/servis/${id}`,
    CREATE: '/servis',
    UPDATE: (id: string) => `/servis/${id}`,
    DELETE: (id: string) => `/servis/${id}`,
    ROUTES: '/servis/routes',
    STUDENTS: (routeId: string) => `/servis/routes/${routeId}/students`,
    LOCATION: (vehicleId: string) => `/servis/vehicles/${vehicleId}/location`,
  },

  // Ödeme (Payment) endpoints
  ODEME: {
    LIST: '/odeme',
    GET: (id: string) => `/odeme/${id}`,
    CREATE: '/odeme',
    VERIFY: (id: string) => `/odeme/${id}/verify`,
    HISTORY: '/odeme/history',
  },

  // Kantin (Canteen) endpoints
  KANTIN: {
    PRODUCTS: {
      LIST: '/kantin/products',
      GET: (id: string) => `/kantin/products/${id}`,
      CREATE: '/kantin/products',
      UPDATE: (id: string) => `/kantin/products/${id}`,
      DELETE: (id: string) => `/kantin/products/${id}`,
    },
    ORDERS: {
      LIST: '/kantin/orders',
      GET: (id: string) => `/kantin/orders/${id}`,
      CREATE: '/kantin/orders',
      UPDATE: (id: string) => `/kantin/orders/${id}`,
      CANCEL: (id: string) => `/kantin/orders/${id}/cancel`,
    },
    BALANCE: {
      GET: '/kantin/balance',
      ADD: '/kantin/balance/add',
      HISTORY: '/kantin/balance/history',
    },
  },

  // Etkinlik (Events) endpoints
  ETKINLIK: {
    LIST: '/etkinlik',
    GET: (id: string) => `/etkinlik/${id}`,
    CREATE: '/etkinlik',
    UPDATE: (id: string) => `/etkinlik/${id}`,
    DELETE: (id: string) => `/etkinlik/${id}`,
    REGISTER: (id: string) => `/etkinlik/${id}/register`,
    PARTICIPANTS: (id: string) => `/etkinlik/${id}/participants`,
  },

  // Duyuru (Announcements) endpoints
  DUYURU: {
    LIST: '/duyuru',
    GET: (id: string) => `/duyuru/${id}`,
    CREATE: '/duyuru',
    UPDATE: (id: string) => `/duyuru/${id}`,
    DELETE: (id: string) => `/duyuru/${id}`,
    MARK_READ: (id: string) => `/duyuru/${id}/read`,
  },

  // Devams1zl1k (Attendance) endpoints
  DEVAMSIZLIK: {
    LIST: '/devamsizlik',
    GET: (id: string) => `/devamsizlik/${id}`,
    MARK: '/devamsizlik/mark',
    REPORT: '/devamsizlik/report',
    STUDENT: (studentId: string) => `/devamsizlik/student/${studentId}`,
  },

  // Notlar (Grades) endpoints
  NOTLAR: {
    LIST: '/notlar',
    GET: (id: string) => `/notlar/${id}`,
    CREATE: '/notlar',
    UPDATE: (id: string) => `/notlar/${id}`,
    DELETE: (id: string) => `/notlar/${id}`,
    STUDENT: (studentId: string) => `/notlar/student/${studentId}`,
    CLASS: (classId: string) => `/notlar/class/${classId}`,
  },

  // Ders Program1 (Schedule) endpoints
  DERS_PROGRAMI: {
    LIST: '/ders-programi',
    GET: (id: string) => `/ders-programi/${id}`,
    CREATE: '/ders-programi',
    UPDATE: (id: string) => `/ders-programi/${id}`,
    DELETE: (id: string) => `/ders-programi/${id}`,
    CLASS: (classId: string) => `/ders-programi/class/${classId}`,
    TEACHER: (teacherId: string) => `/ders-programi/teacher/${teacherId}`,
  },

  // Dönem (Semester) endpoints
  DONEM: {
    LIST: '/donem',
    GET: (id: string) => `/donem/${id}`,
    CREATE: '/donem',
    UPDATE: (id: string) => `/donem/${id}`,
    DELETE: (id: string) => `/donem/${id}`,
    ACTIVE: '/donem/active',
  },
} as const

export default API_ENDPOINTS
