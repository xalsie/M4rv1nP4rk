import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SequelizeService } from "../../services/sequelize/sequelize.service";

const SECRET_KEY: string | undefined = process.env.SECRET_KEY;

const getUser = async (req: Request, res: Response) => {
  if (!SECRET_KEY) {
    res.status(500);
    throw new Error("JWT_SECRET is not defined");
  }

  const authHeader = req.headers["authorization"];
  const jwtToken = authHeader && authHeader.split(" ")[1];

  if (!jwtToken) {
    res.status(401);
    throw new Error("No token, authorization denied");
  }

  const decoded = jwt.verify(jwtToken, SECRET_KEY) as jwt.JwtPayload;

  const sequelizeService = await SequelizeService.get();
  const user = await sequelizeService.userService.findUserById(decoded.id);
  if (!user) {
    res.status(401);
    throw new Error("Authentication failed");
  }
  return user;
};

const validateRole = async (role: string[], req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getUser(req, res);
    if (!role.includes(user.role)) {
      res.status(403);
      throw new Error("You are not authorized to access this route");
    }
    next();
  } catch (error) {
    next(error);
  }
};

export {
  validateRole
};
