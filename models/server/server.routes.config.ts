import express from "express";
import { CommonRoutesConfig } from "../../auth/auth.routes";
import jwtMiddlewares from "../../auth/middlewares/jwt.middlewares";
import commonPermissionsMiddlewares from "../../common/middlewares/common.permissions.middlewares";
import { Permissions } from "../../common/middlewares/common.permissionslevel.type";
import BodyValidationMiddleware from "../../common/middlewares/body.validation.middlewares";
import { body } from "express-validator";
import serversController from "./controllers/servers.controller";
import serversMiddleware from "./middleware/servers.middleware";
export class UserRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "UserRoutes");
  }
  configureRoutes() {
    this.app
      .route(`/servers`)
      .get(serversController.listUsers)
      .post(
        serversMiddleware.validReqServerBodyFields,
        serversMiddleware.validSameServerDoesntExist,
        serversController.createUser
      );

    this.app.param(`serverId`, serversMiddleware.extractServerId);
    this.app
      .route(`/servers/:serverId`)
      .all(serversMiddleware.validateServerExists)
      .get(serversController.getServerById)
      .delete(serversController.removeServer);

    this.app.put(`/servers/:serverId`, [
      serversMiddleware.validReqServerBodyFields,
      serversMiddleware.validSameNameBelongToSameServerID,
      serversController.put,
    ]);

    return this.app;
  }
}
