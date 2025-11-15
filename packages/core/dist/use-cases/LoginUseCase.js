"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUseCase = void 0;
const DomainErrors_1 = require("../errors/DomainErrors");
class LoginUseCase {
    constructor(userRepository, hashService, tokenService) {
        this.userRepository = userRepository;
        this.hashService = hashService;
        this.tokenService = tokenService;
    }
    async execute(input) {
        const user = await this.userRepository.findByEmail(input.email);
        if (!user) {
            throw new DomainErrors_1.UnauthorizedError("Invalid credentials");
        }
        const isPasswordValid = await this.hashService.compare(input.password, user.password);
        if (!isPasswordValid) {
            throw new DomainErrors_1.UnauthorizedError("Invalid credentials");
        }
        const token = this.tokenService.generate({
            id: user.id,
            email: user.email,
        });
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            token,
        };
    }
}
exports.LoginUseCase = LoginUseCase;
