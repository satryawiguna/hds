import { User, Profile } from "../../entities";
import { Email } from "../../value-objects";
import { IUserRepository, IProfileRepository } from "../../interfaces";
import { NotFoundError, ConflictError } from "../../errors";

export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly profileRepository: IProfileRepository
  ) {}

  async execute(
    userId: string,
    data: {
      email?: string;
      isActive?: boolean;
      firstName?: string;
      lastName?: string;
      phoneNumber?: string | null;
      address?: string | null;
      avatar?: string | null;
      dateOfBirth?: Date | null;
    }
  ): Promise<{ user: User; profile: Profile | null }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (data.email && data.email !== user.email) {
      const emailVO = new Email(data.email);
      const existingUser = await this.userRepository.findByEmail(
        emailVO.toString()
      );
      if (existingUser && existingUser.id !== userId) {
        throw new ConflictError("Email already in use");
      }
      user.email = emailVO.toString();
    }

    if (data.isActive !== undefined) {
      if (data.isActive) {
        user.activate();
      } else {
        user.deactivate();
      }
    }

    await this.userRepository.update(user);

    let profile = await this.profileRepository.findByUserId(userId);

    if (profile) {
      const profileData: any = {};
      if (data.firstName !== undefined) profileData.firstName = data.firstName;
      if (data.lastName !== undefined) profileData.lastName = data.lastName;
      if (data.phoneNumber !== undefined)
        profileData.phoneNumber = data.phoneNumber;
      if (data.address !== undefined) profileData.address = data.address;
      if (data.avatar !== undefined) profileData.avatar = data.avatar;
      if (data.dateOfBirth !== undefined)
        profileData.dateOfBirth = data.dateOfBirth;

      profile.update(profileData);
      await this.profileRepository.update(profile);
    }

    return { user, profile };
  }
}
