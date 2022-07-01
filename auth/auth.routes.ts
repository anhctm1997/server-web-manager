import express from "express";
import { CommonRoutesConfig } from "../common/common.routes.config";
import authController from "./controllers/auth.controller";
import jwtMiddlewares from "./middlewares/jwt.middlewares";
import authMiddlewares from "./middlewares/auth.middlewares";
import BodyValidationMiddleware from "../common/middlewares/body.validation.middlewares";
import { body } from "express-validator";

export class AuthRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "AuthRoutes");
  }

  configureRoutes(): express.Application {
    this.app.post(`/auth`, [
      body("email").isEmail(),
      body("password").isString(),
      BodyValidationMiddleware.verifyBodyFieldsErrors,
      authMiddlewares.verifyUserPassword,
      authController.createJWT,
    ]);
    this.app
      .route(`/auth/login`)
      .post(
        authMiddlewares.validateBodyReq,
        authMiddlewares.verifyUserPassword,
        authController.createJWT
      );
    this.app.post(`/auth/refresh-token`, [
      jwtMiddlewares.validJWTNeeded,
      jwtMiddlewares.verifyRefreshBodyField,
      jwtMiddlewares.validRefreshNeeded,
      authController.createJWT,
    ]);
    return this.app;
  }
}
