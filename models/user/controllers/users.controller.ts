import express from "express";
import usersService from "../services/users.service";
import argon2 from "argon2";
import debug from "debug";
import { PatchUserDto } from "../dto/patch.user.dto";
import messageStatus from "../../../configs/constant/messageStatus";
const log: debug.IDebugger = debug("app:users-controller");

class UsersController {
  async listUsers(req: express.Request, res: express.Response) {
    const listUsers = await usersService.list(100, 0);
    res.status(200).json(listUsers);
  }
  async getUserById(req: express.Request, res: express.Response) {
    const user = await usersService.readById(req.params.userId);
    res.status(200).json(user);
  }
  async createUser(req: express.Request, res: express.Response) {
    req.body.password = await argon2.hash(req.body.password);
    const userId = await usersService.create(req.body);
    res.status(201).json(messageStatus(200));
  }
  async patch(req: express.Request, res: express.Response) {
    if (req.body.password) {
      req.body.password = await argon2.hash(req.body.password);
    }
    log(await usersService.patchById(req.params.userId, req.body));
    res.status(204).json(messageStatus(200));
  }
  async put(req: express.Request, res: express.Response) {
    req.body.password = await argon2.hash(req.body.password);
    log(await usersService.putById(req.params.userId, req.body));
    res.status(204).json(messageStatus(200));
  }
  async removeUser(req: express.Request, res: express.Response) {
    log(await usersService.deleteById(req.params.userId));
    res.status(204).json(messageStatus(200));
  }
  async updatePermissions(req: express.Request, res: express.Response) {
    const patchUserDto: PatchUserDto = {
      permissions: parseInt(req.params.permissions),
    };
    log(await usersService.patchById(req.params.userId, patchUserDto));
    res.status(204).json(messageStatus(200));
  }
}

export default new UsersController();
