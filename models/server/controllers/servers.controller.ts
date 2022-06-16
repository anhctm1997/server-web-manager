import express from "express";
import serversService from "../services/servers.service";
import argon2 from "argon2";
import debug from "debug";
import { PatchServerDto } from "../dto/patch.server.dto";
import messageStatus from "../../../configs/constant/messageStatus";
const log: debug.IDebugger = debug("app:users-controller");

class ServersController {
  async listServers(req: express.Request, res: express.Response) {
    const listServers = await serversService.list(100, 0);
    res.status(200).json(listServers);
  }
  async getServerById(req: express.Request, res: express.Response) {
    const server = await serversService.readById(req.params.serverId);
    res.status(200).json(server);
  }
  async createUser(req: express.Request, res: express.Response) {
    req.body.password = await argon2.hash(req.body.password);
    const serverId = await serversService.create(req.body);
    res.status(201).json(messageStatus(200));
  }
  async patch(req: express.Request, res: express.Response) {
    if (req.body.password) {
      req.body.password = await argon2.hash(req.body.password);
    }
    log(await serversService.patchById(req.params.userId, req.body));
    res.status(204).json(messageStatus(200));
  }
  async put(req: express.Request, res: express.Response) {
    req.body.password = await argon2.hash(req.body.password);
    log(await serversService.putById(req.params.userId, req.body));
    res.status(204).json(messageStatus(200));
  }
  async removeUser(req: express.Request, res: express.Response) {
    log(await serversService.deleteById(req.params.userId));
    res.status(204).json(messageStatus(200));
  }
  async updateStatus(req: express.Request, res: express.Response) {
    const status: boolean = req.params.status == "true";
    const patchServerDto: PatchServerDto = {
      status: status,
    };
    log(await serversService.patchById(req.params.serverId, patchServerDto));
    res.status(204).json(messageStatus(200));
  }
}

export default new ServersController();
