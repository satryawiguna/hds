import { Password } from "../../value-objects";
import { IUserRepository, IPasswordHashService } from "../../interfaces";
import { NotFoundError } from "../../errors";

export class ResetPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHashService: IPasswordHashService
  ) {}

  async execute(token: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findByPasswordResetToken(token);

    if (!user) {
      throw new NotFoundError("Invalid or expired password reset token");
    }

    const passwordVO = new Password(newPassword);
    const hashedPassword = await this.passwordHashService.hash(
      passwordVO.toString()
    );

    user.resetPassword(hashedPassword);
    await this.userRepository.update(user);
  }
}
