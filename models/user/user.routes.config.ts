import express from "express";
import { CommonRoutesConfig } from "../../common/common.routes.config";
import jwtMiddlewares from "../../auth/middlewares/jwt.middlewares";
import commonPermissionsMiddlewares from "../../common/middlewares/common.permissions.middlewares";
import { IsAdmin } from "../../common/middlewares/common.permissionslevel.type";
import AuthController from "../../auth/controllers/auth.controller";
import AuthMiddlewares from "../../auth/middlewares/auth.middlewares";
import BodyValidationMiddleware from "../../common/middlewares/body.validation.middlewares";
import { body } from "express-validator";
import UsersController from "./controllers/users.controller";
import UsersMiddleware from "./middleware/users.middleware";
export class UserRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "UserRoutes");
  }
  configureRoutes() {
    this.app
      .route(`/users`)
      .all(jwtMiddlewares.validJWTNeeded)
      .get(UsersController.listUsers)
      .post(
        UsersMiddleware.validReqUserBodyFields,
        UsersMiddleware.validSameUserDoesntExist,
        UsersController.createUser
      );
    this.app.param(`userId`, UsersMiddleware.extractUserId);
    this.app
      .route(`/users/:userId`)
      .all(UsersMiddleware.validateUserExists)
      .get(UsersController.getUserById)
      .delete(UsersController.removeUser);

    this.app.put(`/users/:userId`, [
      UsersMiddleware.validReqUserBodyFields,
      UsersMiddleware.validSameUsernameBelongToSameUser,
      UsersController.put,
    ]);

    return this.app;
  }
}
