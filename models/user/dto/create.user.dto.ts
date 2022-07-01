export interface CreateUserDto {
  username: string;
  password: string;
  isAdmin?: number;
}
