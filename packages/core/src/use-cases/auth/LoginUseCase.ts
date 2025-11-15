import { User, Profile } from "../../entities";
import {
  IUserRepository,
  IProfileRepository,
  IPasswordHashService,
  ITokenService,
} from "../../interfaces";
import { UnauthorizedError } from "../../errors";

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly profileRepository: IProfileRepository,
    private readonly passwordHashService: IPasswordHashService,
    private readonly tokenService: ITokenService
  ) {}

  async execute(data: { email: string; password: string }): Promise<{
    user: User;
    profile: Profile | null;
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    if (!user.isActive) {
      throw new UnauthorizedError(
        "Email not verified. Please verify your email first."
      );
    }

    const isPasswordValid = await this.passwordHashService.compare(
      data.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const accessToken = this.tokenService.generateAccessToken({
      id: user.id,
      email: user.email,
    });
    const refreshToken = this.tokenService.generateRefreshToken({
      id: user.id,
      email: user.email,
    });

    user.setRefreshToken(refreshToken);
    await this.userRepository.update(user);

    const profile = await this.profileRepository.findByUserId(user.id);

    return { user, profile, accessToken, refreshToken };
  }
}
