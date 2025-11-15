export declare class Password {
    private readonly value;
    private readonly minLength;
    constructor(password: string, skipValidation?: boolean);
    private isValid;
    toString(): string;
    static fromHash(hash: string): Password;
}
//# sourceMappingURL=Password.d.ts.map