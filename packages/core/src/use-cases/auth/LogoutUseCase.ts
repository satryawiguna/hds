import { IUserRepository } from "../../interfaces";

export class LogoutUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      return;
    }

    user.setRefreshToken(null);
    await this.userRepository.update(user);
  }
}
