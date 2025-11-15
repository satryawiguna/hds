export class Password {
  private readonly value: string;
  private readonly minLength: number = 8;

  constructor(password: string, skipValidation: boolean = false) {
    if (!skipValidation && !this.isValid(password)) {
      throw new Error(
        `Password must be at least ${this.minLength} characters long`
      );
    }
    this.value = password;
  }

  private isValid(password: string): boolean {
    return password.length >= this.minLength;
  }

  toString(): string {
    return this.value;
  }

  static fromHash(hash: string): Password {
    return new Password(hash, true);
  }
}
