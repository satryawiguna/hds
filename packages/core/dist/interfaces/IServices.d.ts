export interface IHashService {
    hash(value: string): Promise<string>;
    compare(value: string, hash: string): Promise<boolean>;
}
export interface ITokenService {
    generate(payload: any): string;
    verify(token: string): any;
}
//# sourceMappingURL=IServices.d.ts.map