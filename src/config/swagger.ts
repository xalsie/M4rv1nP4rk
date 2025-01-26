import { env } from "../env";
import swaggerJsdoc from "swagger-jsdoc";

interface SwaggerOptions {
  definition: {
    openapi: string;
    info: {
      title: string;
      version: string;
      description: string;
    };
    components: {
      securitySchemes: {
        bearerAuth: {
          type: string;
          scheme: string;
          bearerFormat: string;
        };
      };
    };
    security: { bearerAuth: string[] }[];
    servers: {
      url: string;
      description: string;
    }[];
  };
  apis: string[];
}

const hostname: string = env.API_HOST
const port: number = env.API_PORT

const swaggerOptions: SwaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API GYM",
      version: "1.0.0",
      description: "API documentation",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [{
      bearerAuth: []
    }],
    servers: [
      {
        url: `http://${hostname}:${port}`,
        description: "Development server",
      },
    ],
  },
  apis: [
    "src/controllers/*.ts",
    "src/services/sequelize/schema/*.schema.ts",
    // "src/services/sequelize/schema/user.schema.ts",
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
if (!swaggerSpec) {
  throw new Error(
    "Erreur lors de la configuration de Swagger : swaggerSpec est undefined."
  );
}

export default swaggerSpec;
