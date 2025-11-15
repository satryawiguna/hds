import { User, Profile } from "../../entities";
import { IUserRepository, IProfileRepository } from "../../interfaces";

export class GetAllUsersUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly profileRepository: IProfileRepository
  ) {}

  async execute(
    page?: number,
    limit?: number
  ): Promise<{
    users: Array<{ user: User; profile: Profile | null }>;
    total: number;
  }> {
    const { users, total } = await this.userRepository.findAll(page, limit);

    const usersWithProfiles = await Promise.all(
      users.map(async (user) => {
        const profile = await this.profileRepository.findByUserId(user.id);
        return { user, profile };
      })
    );

    return { users: usersWithProfiles, total };
  }
}
