import express from "express";
import jwt, { Jwt } from "jsonwebtoken";
import crypto from "crypto";
import { jwtType } from "../../common/type/jwt.type";
import { key } from "../../configs/constant/key";
import messageStatus from "../../configs/constant/messageStatus";
import usersService from "../../models/user/services/users.service";

const jwtSecret: string = key.jwt || "";

class JwtMiddlewares {
  verifyResfreshBodyField(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.body && req.body.resfreshToken) {
      return next();
    } else {
      return res.status(400).json(messageStatus(400));
    }
  }

  async validRefreshNeeded(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user: any = await usersService.getUserByUsernameWithPassword(
      res.locals.jwt.username
    );
    const salt = crypto.createSecretKey(
      Buffer.from(res.locals.jwt.refreshKey.data)
    );
    const hash = crypto
      .createHmac("sha512", salt)
      .update(res.locals.jwt.userId + jwtSecret)
      .digest("base64");
    if (hash === req.body.refreshToken) {
      req.body = {
        userId: user._id,
        username: user.username,
        provider: "username",
        permissions: user.permissions,
      };
      return next();
    } else {
      return res.status(400).json(messageStatus(400, "Invalid refresh token"));
    }
  }
  validJWTNeeded(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.headers["authorization"]) {
      try {
        const authorization = req.headers["authorization"].split(" ");
        if (authorization[0] !== "Bearer") {
          return res.status(401).json(messageStatus(401));
        } else {
          res.locals.jwt = jwt.verify(authorization[1], jwtSecret) as Jwt;
          next();
        }
      } catch (err) {
        return res.status(403).json(messageStatus(403));
      }
    } else {
      return res.status(401).json(messageStatus(401));
    }
  }
}
export default new JwtMiddlewares();
