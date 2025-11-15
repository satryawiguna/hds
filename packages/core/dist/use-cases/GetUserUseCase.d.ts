import { IUserRepository } from '../interfaces/IUserRepository';
export interface GetUserInput {
    userId: string;
}
export interface GetUserOutput {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
}
export declare class GetUserUseCase {
    private userRepository;
    constructor(userRepository: IUserRepository);
    execute(input: GetUserInput): Promise<GetUserOutput>;
}
//# sourceMappingURL=GetUserUseCase.d.ts.map