export interface CreateServerDto {
  name: string;
  password: string;
  ip: string;
  status: boolean;
  cpu: string;
  ram: number;
  http: boolean;
  https: boolean;
}
