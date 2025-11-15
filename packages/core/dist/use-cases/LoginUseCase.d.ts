import { IUserRepository } from "../../interfaces/IUserRepository";
import { IHashService, ITokenService } from "../../interfaces/IServices";
export interface LoginInput {
  email: string;
  password: string;
}
export interface LoginOutput {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
}
export declare class LoginUseCase {
  private userRepository;
  private hashService;
  private tokenService;
  constructor(
    userRepository: IUserRepository,
    hashService: IHashService,
    tokenService: ITokenService
  );
  execute(input: LoginInput): Promise<LoginOutput>;
}
//# sourceMappingURL=LoginUseCase.d.ts.map
