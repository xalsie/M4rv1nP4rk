import { NextFunction, Request, Response, Router } from "express";
import { authenticateToken } from "../middlewares/jwt";
import { validateObjectId } from "../middlewares/validate";
import {
  validateRole
} from "../middlewares/validator/validateRole";
import { SequelizeService } from "../services/sequelize/sequelize.service";

export class UserController {
  /**
   * @swagger
   * /api/users/{id}:
   *  get:
   *    summary: Get user by id
   *    tags: [Users]
   *    parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: string
   *        required: true
   *        description: ID of the user to get
   *    responses:
   *      200:
   *        description: List of users
   *        content:
   *          application/json:
   *            schema:
   *              type: array
   *              items:
   *                $ref: '#/components/schemas/User'
   *      401:
   *        description: Unauthorized
   *      403:
   *        description: Forbidden
   *      404:
   *        description: Not found
   *      500:
   *        description: Server error
   */
  async getOneUser(req: Request, res: Response, next: NextFunction) {
    try {
      // if (!req.params.id) {
        res.status(400);
      //   throw new Error("Missing id parameter");
      // }
      // const sequelizeService = await SequelizeService.get();
      // const user = await sequelizeService.userService.findUserById(
      //   req.params.id
      // );
      // if (!user) {
      //   res.status(404);
      //   throw new Error("User not found");
      // }
      // res.status(200).json(user);
      return;
    } catch (error) {
      if (!res.statusCode) {
        res.status(500);
      }
      next(error);
    }
  }

  /**
   * @swagger
   * /api/users:
   *  get:
   *    summary: Get all users
   *    tags: [Users]
   *    responses:
   *      200:
   *        description: List of users
   *        content:
   *          application/json:
   *            schema:
   *              type: array
   *              items:
   *                $ref: '#/components/schemas/User'
   *      401:
   *        description: Unauthorized
   *      403:
   *        description: Forbidden
   *      404:
   *        description: Not found
   *      500:
   *        description: Server error
   */
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      // const sequelizeService = await SequelizeService.get();
      const sequelizeService = await SequelizeService.get();
      const users = await sequelizeService.userService.findAllUsers();
      if (!users) {
        res.status(404);
        throw new Error("Users not found");
      }
      res.status(200).json(users);
      return;
    } catch (error) {
      if (!res.statusCode) {
        res.status(500);
      }
      next(error);
    }
  }

  /**
   * @swagger
   * /api/users/{id}:
   *   put:
   *     summary: Update user by ID
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID of the user to update
   *     requestBody:
   *       description: Update an existent user
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: Nom de l'utilisateur
   *               email:
   *                 type: string
   *                 description: Email de l'utilisateur
   *               password:
   *                 type: string
   *                 description: Mot de passe de l'utilisateur
   *             example:
   *               name: John Doe
   *               email: johndoe@example.com
   *               password: myPassword123
   *     responses:
   *       200:
   *         description: User successfully updated
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       400:
   *         description: Bad request - Invalid data or parameters
   *       401:
   *         description: Unauthorized - Authentication failed
   *       403:
   *         description: Forbidden - You don't have access to perform this action
   *       404:
   *         description: Not found - User ID not found
   *       500:
   *         description: Internal server error - Something went wrong
   */
  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      // if (!req.params.id || !req.body) {
        res.status(400);
      //   throw new Error("Missing id parameter or body");
      // }
      // const sequelizeService = await SequelizeService.get();
      // const user = await sequelizeService.userService.updateUser(
      //   req.params.id,
      //   req.body
      // );
      // if (!user) {
      //   res.status(404);
      //   throw new Error("User not found");
      // }
      // res.status(200).json(user);
      return;
    } catch (error) {
      if (!res.statusCode) {
        res.status(500);
      }
      next(error);
    }
  }

  /**
   * @swagger
   * /api/users/{id}:
   *  delete:
   *    summary: Delete user by id
   *    tags: [Users]
   *    parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: string
   *        required: true
   *        description: ID of the user to get
   *    responses:
   *      200:
   *        description: List of users
   *        content:
   *          application/json:
   *            schema:
   *              type: array
   *              items:
   *                $ref: '#/components/schemas/User'
   *      400:
   *        description: Bad request
   *      401:
   *        description: Unauthorized
   *      403:
   *        description: Forbidden
   *      404:
   *        description: Not found
   *      500:
   *        description: Server error
   */
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      // if (!req.params.id) {
        res.status(400);
      //   throw new Error("Missing id parameter");
      // }
      // const sequelizeService = await SequelizeService.get();
      // const user = await sequelizeService.userService.deleteUser(req.params.id);
      // if (!user) {
      //   res.status(404);
      //   throw new Error("User not found");
      // }
      // res.status(200).json(user);
      return;
    } catch (error) {
      if (!res.statusCode) {
        res.status(500);
      }
      next(error);
    }
  }

  buildRouter(): Router {
    const router = Router();
    router.get(
      "/:id",
      authenticateToken,
      validateRole.bind(["ROLE_ADMIN"]),
      this.getOneUser.bind(this)
    );
    router.get(
      "/",
      authenticateToken,
      validateRole.bind(["ROLE_ADMIN"]),
      this.getUsers.bind(this)
    );
    router.put(
      "/:id",
      authenticateToken,
      validateRole.bind(["ROLE_ADMIN", "ROLE_USER"]),
      validateObjectId,
      this.updateUser.bind(this)
    );
    router.delete(
      "/:id",
      authenticateToken,
      validateRole.bind(["ROLE_ADMIN", "ROLE_USER"]),
      validateObjectId,
      this.deleteUser.bind(this)
    );
    return router;
  }
}
