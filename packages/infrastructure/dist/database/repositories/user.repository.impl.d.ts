import { Knex } from 'knex';
import { IUserRepository, User, CreateUserInput, UpdateUserInput } from '@hds/core';
export declare class UserRepositoryImpl implements IUserRepository {
    private db;
    constructor(db: Knex);
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(input: CreateUserInput): Promise<User>;
    update(id: string, input: UpdateUserInput): Promise<User>;
    delete(id: string): Promise<void>;
    private mapToEntity;
}
//# sourceMappingURL=user.repository.impl.d.ts.map