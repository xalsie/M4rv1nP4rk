import { env } from "./env";
import express, { Express, NextFunction, Request, Response } from "express";

// Configurations
import configureCORS from "./config/cors";
import database from "./config/database";
import configureHelmet from "./config/helmet";
import logger from "./config/logger";
import configureCompression from "./config/compression";

// Middlewares
import errorHandler from "./middlewares/errorHandler";

// Routes
import {
    Swagger,
    AuthController,
    UserController
} from "./controllers";

const app: Express = express();

// config
configureCORS(app);
configureHelmet(app);
configureCompression(app);
database();

// Security
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// traque des requêtes
app.use((req: Request, res: Response, next: NextFunction) => {
    if (env.NODE_ENV === "development") {
        logger.http(`${req.method} ${req.url}`, {
            method: req.method,
            url: req.url,
            ip: req.ip,
            userAgent: req.headers["user-agent"],
        });
    }
    next();
});

// Routes
app.get("/", (req: Request, res: Response) => {
    res.send("API -> M4RV1NP4RK");
});

// Swagger
const swagger = new Swagger();
app.use("/api", swagger.buildRouter());

const authController = new AuthController();
app.use("/api/auth", authController.buildRouter());

const userController = new UserController();
app.use("/api/users", userController.buildRouter());

// Middleware d'erreurs global
app.use(errorHandler(logger));

app.listen({ host: "0.0.0.0", port: env.API_PORT }, () => {
    logger.info(`🚀 Server is running on http://localhost:${env.API_PORT}/`);
    logger.info(`Swagger UI available at http://localhost:${env.API_PORT}/api/doc`);
});
