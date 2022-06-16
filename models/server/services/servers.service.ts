import ServersDao from "../daos/server.dao";
import { CRUD } from "../../../common/interfaces/crud.interface";
import { CreateServerDto } from "../dto/create.server.dto";
import { PutServerDto } from "../dto/put.server.dto";
import { PatchServerDto } from "../dto/patch.server.dto";

class ServersService implements CRUD {
  async create(resource: CreateServerDto) {
    return ServersDao.addServer(resource);
  }
  async deleteById(id: string) {
    return ServersDao.removeServerById(id);
  }
  async list(limit: number, page: number) {
    return ServersDao.getServers(limit, page);
  }
  async patchById(id: string, resource: PatchServerDto): Promise<any> {
    return ServersDao.updateServerById(id, resource);
  }
  async putById(id: string, resource: PutServerDto): Promise<any> {
    return ServersDao.updateServerById(id, resource);
  }
  async readById(id: string) {
    return ServersDao.getServerById(id);
  }
  async updateById(id: string, resource: CreateServerDto): Promise<any> {
    return ServersDao.updateServerById(id, resource);
  }
  async getServerByName(name: string) {
    return ServersDao.getServerByServerName(name);
  }
  async getServerByIdWithPassword(id: string) {
    return ServersDao.getServerByIdWithPassword(id);
  }
}
export default new ServersService();
