export interface CreateUserDto {
  username: string;
  password: string;
  permissions?: number;
}
