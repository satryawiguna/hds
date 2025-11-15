import { User, Profile } from "../../entities";
import { IUserRepository, IProfileRepository } from "../../interfaces";
import { NotFoundError } from "../../errors";

export class GetUserByIdUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly profileRepository: IProfileRepository
  ) {}

  async execute(
    userId: string
  ): Promise<{ user: User; profile: Profile | null }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const profile = await this.profileRepository.findByUserId(userId);
    return { user, profile };
  }
}
