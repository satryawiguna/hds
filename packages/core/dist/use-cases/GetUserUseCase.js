"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserUseCase = void 0;
const DomainErrors_1 = require("../errors/DomainErrors");
class GetUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(input) {
        const user = await this.userRepository.findById(input.userId);
        if (!user) {
            throw new DomainErrors_1.NotFoundError('User not found');
        }
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
        };
    }
}
exports.GetUserUseCase = GetUserUseCase;
