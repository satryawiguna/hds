export interface ApiResponse<T = any> {
    status: 'success' | 'error';
    data?: T;
    message?: string;
    errors?: any;
}
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export interface User {
    id: string;
    email: string;
    name: string;
}
export interface AuthResponse {
    user: User;
    token: string;
}
//# sourceMappingURL=api.types.d.ts.map