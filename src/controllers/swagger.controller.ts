import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../config/swagger";

export class Swagger {
    buildRouter(): Router {
        const router = Router();
        router.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
        return router;
    }
}