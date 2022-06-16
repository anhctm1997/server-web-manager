import express from "express";
import { Permissions } from "./common.permissionslevel.type";
import messageStatus from "../../configs/constant/messageStatus";
import debug from "debug";
const log: debug.IDebugger = debug("app:common-permission-middleware");
class CommonPermissionsMiddlewares {
  memberPermissionLevelRequire(requiredPermissionLevel: Permissions) {
    return (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      try {
        const userPermissionLevel = parseInt(res.locals.jwt.permissionLevel);
        if (userPermissionLevel & requiredPermissionLevel) {
          next();
        } else {
          res.status(403).json(messageStatus(403));
        }
      } catch (e) {
        log(e);
      }
    };
  }
  async onlySameUserOrAdminCanDoThisAction(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const userPermissionLevel = parseInt(res.locals.jwt.permissionLevel);
    if (
      req.params &&
      req.params.userId &&
      req.params.userId === res.locals.jwt.userId
    ) {
      return next();
    } else {
      if (userPermissionLevel & Permissions.ADMIN_PERMISSION) {
        return next();
      } else {
        return res.status(403).json(messageStatus(403));
      }
    }
  }
  async onlyAdminCanDoThisAction(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const userPermissionLevel = parseInt(res.locals.jwt.permissionLevel);
    if (userPermissionLevel & Permissions.ADMIN_PERMISSION) {
      return next();
    } else {
      return res.status(403).json(messageStatus(403));
    }
  }
}

export default new CommonPermissionsMiddlewares();
