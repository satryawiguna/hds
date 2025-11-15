import { User, Profile } from "../../entities";
import { Email, Password } from "../../value-objects";
import {
  IUserRepository,
  IProfileRepository,
  IPasswordHashService,
  ITokenService,
  IEmailService,
} from "../../interfaces";
import { ConflictError } from "../../errors";

export class RegisterUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly profileRepository: IProfileRepository,
    private readonly passwordHashService: IPasswordHashService,
    private readonly tokenService: ITokenService,
    private readonly emailService: IEmailService
  ) {}

  async execute(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    address?: string;
    avatar?: string;
    dateOfBirth?: Date;
  }): Promise<{ user: User; profile: Profile }> {
    const emailVO = new Email(data.email);

    const existingUser = await this.userRepository.findByEmail(
      emailVO.toString()
    );

    if (existingUser) {
      throw new ConflictError("Email already registered");
    }

    const passwordVO = new Password(data.password);
    const hashedPassword = await this.passwordHashService.hash(
      passwordVO.toString()
    );

    const emailVerificationToken =
      this.tokenService.generateEmailVerificationToken();

    const user = User.create(
      emailVO.toString(),
      hashedPassword,
      emailVerificationToken
    );

    await this.userRepository.create(user);

    const profile = Profile.create(
      user.id,
      data.firstName,
      data.lastName,
      data.phoneNumber,
      data.address,
      data.avatar,
      data.dateOfBirth
    );

    await this.profileRepository.create(profile);
    await this.emailService.sendVerificationEmail(
      user.email,
      emailVerificationToken
    );

    return { user, profile };
  }
}
