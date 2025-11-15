"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepositoryImpl = void 0;
class UserRepositoryImpl {
    constructor(db) {
        this.db = db;
    }
    async findById(id) {
        const user = await this.db('users').where({ id }).first();
        return user ? this.mapToEntity(user) : null;
    }
    async findByEmail(email) {
        const user = await this.db('users').where({ email }).first();
        return user ? this.mapToEntity(user) : null;
    }
    async create(input) {
        const [id] = await this.db('users').insert({
            email: input.email,
            password: input.password,
            name: input.name,
            created_at: new Date(),
            updated_at: new Date(),
        });
        const user = await this.findById(id.toString());
        if (!user) {
            throw new Error('Failed to create user');
        }
        return user;
    }
    async update(id, input) {
        await this.db('users')
            .where({ id })
            .update({
            ...input,
            updated_at: new Date(),
        });
        const user = await this.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
    async delete(id) {
        await this.db('users').where({ id }).delete();
    }
    mapToEntity(row) {
        return {
            id: row.id.toString(),
            email: row.email,
            password: row.password,
            name: row.name,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }
}
exports.UserRepositoryImpl = UserRepositoryImpl;
