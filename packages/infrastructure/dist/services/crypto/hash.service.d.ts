import { IHashService } from '@hds/core';
export declare class BcryptHashService implements IHashService {
    hash(value: string): Promise<string>;
    compare(value: string, hash: string): Promise<boolean>;
}
//# sourceMappingURL=hash.service.d.ts.map