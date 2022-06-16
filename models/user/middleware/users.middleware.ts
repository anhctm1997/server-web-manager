import express from "express";
import messageStatus from "../../../configs/constant/messageStatus";
import userService from "../services/users.service";
class UsersMiddleware {
  async validReqUserBodyFields(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.body && req.body.email && req.body.password) {
      next();
    } else {
      res
        .status(400)
        .json(
          messageStatus(400, "Missing required fields: email and password")
        );
    }
  }
  async validSameUserDoesntExist(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user = await userService.getUserByUsername(req.body.username);
    if (user) {
      res.status(400).json(messageStatus(400, "User username already exists"));
    } else {
      next();
    }
  }
  async validSameUsernameBelongToSameUser(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user = await userService.getUserByUsername(req.body.username);
    if (user && user.id === req.params.userId) {
      res.locals.user = user;
      next();
    } else {
      res.status(400).json(messageStatus(400, "Invalid email"));
    }
  }
  async userCantChangePermission(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (res.locals.user.permissions !== req.body.permissions) {
      res
        .status(403)
        .json(messageStatus(403, "User cannot change permission level"));
    } else {
      next();
    }
  }
  async validateUserExists(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user = await userService.readById(req.params.userId);
    if (user) {
      next();
    } else {
      res
        .status(404)
        .json(messageStatus(400, `User ${req.params.userId} not found`));
    }
  }
  async extractUserId(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    req.body.id = req.params.userId;
    next();
  }
}

export default new UsersMiddleware();
