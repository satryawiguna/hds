export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateUserInput {
    email: string;
    password: string;
    name: string;
}
export interface UpdateUserInput {
    email?: string;
    name?: string;
}
//# sourceMappingURL=User.d.ts.map