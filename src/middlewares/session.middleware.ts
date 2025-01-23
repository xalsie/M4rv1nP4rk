import { NextFunction, Request, RequestHandler, Response } from "express";
import { Session } from "../models";
import { SequelizeService } from "../services/sequelize/sequelize.service";

declare module "express" {
  interface Request {
    session?: Session;
  }
}

export function sessionMiddleware(): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorization = req.headers.authorization;
      if (!authorization) {
        res.status(401);
        throw new Error("Unauthorized");
      }
      // Authorization: Bearer XXXX
      const authorizationSplit = authorization.split(" ");
      if (
        authorizationSplit.length !== 2 ||
        authorizationSplit[0] !== "Bearer"
      ) {
        res.status(401);
        throw new Error("Unauthorized");
      }
      const token = authorizationSplit[1];
      const sequelizeService = await SequelizeService.get();
      let session = await sequelizeService.sessionService.findActiveSession(token)
      if (session === null) {
        res.status(401);
        throw new Error("Unauthorized");
      }
      if (session.expirationDate) {
        session = await sequelizeService.sessionService.increaseExpirationDate(
          session.id
        );
      }
      req.session = session === null ? undefined : session;
      next();
    } catch (error) {
      if (!res.statusCode) {
        res.status(500);
      }
      next(error);
    }
  };
}
