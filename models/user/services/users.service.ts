import UsersDao from "../daos/user.dao";
import { CRUD } from "../../../common/interfaces/crud.interface";
import { CreateUserDto } from "../dto/create.user.dto";
import { PutUserDto } from "../dto/put.user.dto";
import { PatchUserDto } from "../dto/patch.user.dto";

class UsersService implements CRUD {
  async create(resource: CreateUserDto) {
    resource.isAdmin = 1;
    return UsersDao.addUser(resource);
  }
  async deleteById(id: string) {
    return UsersDao.removeUserById(id);
  }
  async list(limit, page) {
    return UsersDao.getUsers(limit, page);
  }
  async patchById(id: string, resource: PatchUserDto): Promise<any> {
    return UsersDao.updateUserById(id, resource);
  }
  async putById(id: string, resource: PutUserDto): Promise<any> {
    return UsersDao.updateUserById(id, resource);
  }
  async readById(id: string) {
    return UsersDao.getUserById(id);
  }
  async updateById(id: string, resource: CreateUserDto): Promise<any> {
    return UsersDao.updateUserById(id, resource);
  }
  async getUserByUsername(username: string) {
    return UsersDao.getUserByUsername(username);
  }
  async getUserByUsernameWithPassword(username: string) {
    return UsersDao.getUserByUsernameWithPassword(username);
  }
}
export default new UsersService();
