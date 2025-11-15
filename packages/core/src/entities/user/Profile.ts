export class Profile {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public firstName: string,
    public lastName: string,
    public phoneNumber: string | null,
    public address: string | null,
    public avatar: string | null,
    public dateOfBirth: Date | null,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  static create(
    userId: string,
    firstName: string,
    lastName: string,
    phoneNumber?: string,
    address?: string,
    avatar?: string,
    dateOfBirth?: Date
  ): Profile {
    return new Profile(
      crypto.randomUUID(),
      userId,
      firstName,
      lastName,
      phoneNumber || null,
      address || null,
      avatar || null,
      dateOfBirth || null,
      new Date(),
      new Date()
    );
  }

  update(data: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string | null;
    address?: string | null;
    avatar?: string | null;
    dateOfBirth?: Date | null;
  }): void {
    if (data.firstName !== undefined) this.firstName = data.firstName;
    if (data.lastName !== undefined) this.lastName = data.lastName;
    if (data.phoneNumber !== undefined) this.phoneNumber = data.phoneNumber;
    if (data.address !== undefined) this.address = data.address;
    if (data.avatar !== undefined) this.avatar = data.avatar;
    if (data.dateOfBirth !== undefined) this.dateOfBirth = data.dateOfBirth;
    this.updatedAt = new Date();
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
