import express from "express";
import * as argon2 from "argon2";
import messageStatus from "../../configs/constant/messageStatus";
import usersService from "../../models/user/services/users.service";
class AuthMiddleware {
  async validateBodyReq(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.body && req.body.username && req.body.password) {
      next();
    } else {
      res.status(400).json(messageStatus(400));
    }
  }
  async validateUserPassword(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user: any = await usersService.getUserByUsernameWithPassword(
      req.body.email
    );
    if (user) {
      const passwordHash = user.password;
      if (await argon2.verify(passwordHash, req.body.password)) {
        req.body = {
          userId: user._id,
          username: user.username,
          provider: "username",
          permissions: user.permissions,
        };
        return next();
      } else {
        res.status(400).json(messageStatus(400));
      }
    } else {
      res.status(400).json(messageStatus(400));
    }
  }
}
export default new AuthMiddleware();
