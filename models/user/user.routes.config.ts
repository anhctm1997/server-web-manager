import express from "express";
import { CommonRoutesConfig } from "../../auth/auth.routes";
import jwtMiddlewares from "../../auth/middlewares/jwt.middlewares";
import commonPermissionsMiddlewares from "../../common/middlewares/common.permissions.middlewares";
import { PermissionLevel } from "../../common/middlewares/common.permissionslevel.type";
import BodyValidationMiddleware from "../../common/middlewares/body.validation.middlewares";
import { body } from "express-validator";
import usersController from "./controllers/users.controller";
import usersMiddleware from "./middleware/users.middleware";
export class UserRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "UserRoutes");
  }
  configureRoutes() {
    this.app
      .route(`/users`)
      .get(usersController.listUsers)
      .post(
        usersMiddleware.validReqUserBodyFields,
        usersMiddleware.validSameUserDoesntExist,
        usersController.createUser
      );

    this.app.param(`userId`, usersMiddleware.extractUserId);
    this.app
      .route(`/users/:userId`)
      .all(usersMiddleware.validateUserExists)
      .get(usersController.getUserById)
      .delete(usersController.removeUser);

    this.app.put(`/users/:userId`, [
      usersMiddleware.validReqUserBodyFields,
      usersMiddleware.validSameUsernameBelongToSameUser,
      usersController.put,
    ]);

    return this.app;
  }
}
