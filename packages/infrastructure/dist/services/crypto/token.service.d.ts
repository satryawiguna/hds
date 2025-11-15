import { ITokenService } from "@hds/core";
export declare class JwtTokenService implements ITokenService {
    private secret;
    private expiresIn;
    constructor(secret: string, expiresIn?: string);
    generate(payload: any): string;
    verify(token: string): any;
}
//# sourceMappingURL=token.service.d.ts.map