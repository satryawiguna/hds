import { User, CreateUserInput, UpdateUserInput } from "../entities/user/User";
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(input: CreateUserInput): Promise<User>;
  update(id: string, input: UpdateUserInput): Promise<User>;
  delete(id: string): Promise<void>;
}
//# sourceMappingURL=IUserRepository.d.ts.map
