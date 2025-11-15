export declare class DomainError extends Error {
    constructor(message: string);
}
export declare class ValidationError extends DomainError {
    constructor(message: string);
}
export declare class NotFoundError extends DomainError {
    constructor(message: string);
}
export declare class UnauthorizedError extends DomainError {
    constructor(message: string);
}
export declare class ConflictError extends DomainError {
    constructor(message: string);
}
//# sourceMappingURL=DomainErrors.d.ts.map