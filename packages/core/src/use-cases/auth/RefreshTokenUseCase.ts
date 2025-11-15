import { IUserRepository, ITokenService } from "../../interfaces";
import { UnauthorizedError } from "../../errors";

export class RefreshTokenUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService
  ) {}

  async execute(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      this.tokenService.verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    const user = await this.userRepository.findByRefreshToken(refreshToken);
    if (!user || !user.isActive) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    const newAccessToken = this.tokenService.generateAccessToken({
      id: user.id,
      email: user.email,
    });
    const newRefreshToken = this.tokenService.generateRefreshToken({
      id: user.id,
      email: user.email,
    });

    user.setRefreshToken(newRefreshToken);
    await this.userRepository.update(user);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
