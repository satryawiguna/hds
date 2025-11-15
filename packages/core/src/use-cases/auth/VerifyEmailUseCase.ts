import { IUserRepository } from "../../interfaces";
import { NotFoundError } from "../../errors";

export class VerifyEmailUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(token: string): Promise<void> {
    const user = await this.userRepository.findByEmailVerificationToken(token);
    if (!user) {
      throw new NotFoundError("Invalid or expired verification token");
    }

    user.verifyEmail();
    await this.userRepository.update(user);
  }
}
