import { api_port, mode_env } from "./config";
import express, { Express, NextFunction, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";

// Configurations
import configureCORS from "./config/cors";
import database from "./config/database";
import configureHelmet from "./config/helmet";
import logger from "./config/logger";
import swaggerSpec from "./config/swagger";
import configureCompression from "./config/compression";

// Middlewares
import errorHandler from "./middlewares/errorHandler";

// Routes
// import {
//   AuthController,
//   UserController,
// } from "./controllers";

const app: Express = express();

// config
configureCORS(app);
configureHelmet(app);
configureCompression(app);

// Security
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// traque des requêtes
app.use((req: Request, res: Response, next: NextFunction) => {
  if (mode_env === "development") {
    logger.http(`${req.method} ${req.url}`, {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
  }
  next();
});

// Swagger
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the API");
});

// const authController = new AuthController();
// app.use("/api/auth", authController.buildRouter());
// const userController = new UserController();
// app.use("/api/users", userController.buildRouter());

// Middleware d'erreurs global
app.use(errorHandler(logger));

// Listen to the server
const port: number = api_port;

app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}/`);
  logger.info(`Swagger UI available at http://localhost:${port}/doc`);

  database();
});
