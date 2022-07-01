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
  async validateIsAdmin(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.body.isAdmin === 1) next();
    res.status(403).json(messageStatus(403, "You not a admin"));
  }
  async verifyUserPassword(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user: any = await usersService.getUserByUsernameWithPassword(
      req.body.username
    );
    if (user) {
      const passwordHashed = user.password;
      if (await argon2.verify(passwordHashed, req.body.password)) {
        req.body = {
          _id: user._id,
          username: user.username,
          isAdmin: user.isAdmin,
        };
        return next();
      } else {
        res.status(404).json(messageStatus(404, "Password not macth"));
      }
    } else {
      res.status(404).json(messageStatus(404, "Username not found"));
    }
  }
}
export default new AuthMiddleware();
