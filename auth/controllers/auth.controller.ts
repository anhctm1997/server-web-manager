import express from "express";
import debug from "debug";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { key } from "../../configs/constant/key";
import messageStatus from "../../configs/constant/messageStatus";
const log: debug.IDebugger = debug("app:auth-controller");
const jwtSecret: string = key.jwt || "";
class AuthController {
  async createJWT(req: express.Request, res: express.Response) {
    try {
      const refreshId = req.body.userId + key.jwt;
      const salt = crypto.createSecretKey(crypto.randomBytes(16));
      const hash = crypto
        .createHmac("sha512", salt)
        .update(refreshId)
        .digest("base64");
      req.body.refreshKey = salt.export();
      const token = jwt.sign(req.body, jwtSecret, key.expTime(30));
      return res.status(201).json({
        accessToken: token,
        refreshToken: hash,
      });
    } catch (error) {
      log("createJWT error: %O", error);
      return res.status(500).json(messageStatus(500));
    }
  }
}

export default new AuthController();
