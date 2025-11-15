import { IUserRepository } from "../../interfaces";
import { NotFoundError } from "../../errors";

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    await this.userRepository.delete(userId);
  }
}
