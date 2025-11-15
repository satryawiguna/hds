import {
  IUserRepository,
  ITokenService,
  IEmailService,
} from "../../interfaces";

export class ForgotPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService,
    private readonly emailService: IEmailService
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return;
    }

    const resetToken = this.tokenService.generatePasswordResetToken();
    const expiresInMinutes = 60;
    user.setPasswordResetToken(resetToken, expiresInMinutes);
    await this.userRepository.update(user);

    await this.emailService.sendPasswordResetEmail(user.email, resetToken);
  }
}
