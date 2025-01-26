import { NextFunction, Request, Response, Router } from "express";
import { authenticateToken } from "../middlewares/jwt";
import { validateRole } from "../middlewares";
import { SequelizeService } from "../services/sequelize/sequelize.service";
import { z } from "zod";

export class RoomController {
    /**
     * @swagger
     * /api/rooms:
     *   post:
     *     summary: Create a new training room
     *     tags: [Rooms]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *               - capacity
     *               - managerId
     *             properties:
     *               name:
     *                 type: string
     *                 description: Nom de la salle
     *               capacity:
     *                 type: integer
     *                 description: Capacité d'accueil
     *               managerId:
     *                 type: integer
     *                 description: ID du responsable de la salle
     *             example:
     *               name: "Salle Musculation Pro"
     *               capacity: 30
     *               managerId: 1
     *     responses:
     *       201:
     *         description: Room created successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Room'
     *       400:
     *         description: Bad request
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     *       500:
     *         description: Server error
     */
    async createRoom(req: Request, res: Response, next: NextFunction) {
        try {
            const roomSchema = z.object({
                name: z.string().min(3).max(50),
                capacity: z.number().positive().int(),
                managerId: z.number().positive().int(),
            });

            if (!req.body || !roomSchema.safeParse(req.body).success) {
                res.status(400);
                throw new Error("Invalid room data");
            }

            const sequelizeService = await SequelizeService.get();
            const room = await sequelizeService.roomService.createRoom(req.body);

            res.status(201).json(room);
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
     * /api/rooms/{id}:
     *   get:
     *     summary: Get room by ID
     *     tags: [Rooms]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: Room ID
     *     responses:
     *       200:
     *         description: Room found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: integer
     *                 name:
     *                   type: string
     *                 capacity:
     *                   type: integer
     *                 managerId:
     *                   type: integer
     *                 equipments:
     *                   type: object
     *                   properties:
     *                     id:
     *                       type: integer
     *                     name:
     *                       type: string
     *                     description:
     *                       type: string
     *                     status:
     *                       type: string
     *                     serialNumber:
     *                       type: string
     *                     createdAt:
     *                       type: string
     *                       format: date-time
     *                     updatedAt:
     *                       type: string
     *                       format: date-time
     *                 createdAt:
     *                   type: string
     *                   format: date-time
     *                 updatedAt:
     *                   type: string
     *                   format: date-time   
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     *       404:
     *         description: Not found
     *       500:
     *         description: Server error
     */
    async getRoom(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const idSchema = z.number().positive().int();

            if (!id || !idSchema.safeParse(id).success) {
                res.status(400);
                throw new Error("Invalid room ID");
            }

            const sequelizeService = await SequelizeService.get();
            const room = await sequelizeService.roomService.findRoomById(id);

            if (!room) {
                res.status(404);
                throw new Error("Room not found");
            }

            res.status(200).json(room);
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
     * /api/rooms:
     *  get:
     *    summary: Get all rooms
     *    tags: [Rooms]
     *    responses:
     *      200:
     *        description: List of rooms
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                id:
     *                  type: integer
     *                name:
     *                  type: string
     *                capacity:
     *                  type: integer
     *                managerId:
     *                  type: integer
     *                equipments:
     *                  type: object
     *                  properties:
     *                    id:
     *                      type: integer
     *                    name:
     *                      type: string
     *                    description:
     *                      type: string
     *                    status:
     *                      type: string
     *                    serialNumber:
     *                      type: string
     *                    createdAt:
     *                      type: string
     *                      format: date-time
     *                    updatedAt:
     *                      type: string
     *                      format: date-time
     *                createdAt:
     *                  type: string
     *                  format: date-time
     *                updatedAt:
     *                  type: string
     *                  format: date-time   
     *      401:
     *        description: Unauthorized
     *      403:
     *        description: Forbidden
     *      404:
     *        description: Not found
     *      500:
     *        description: Server error
     */
    async getAllRooms(req: Request, res: Response, next: NextFunction) {
        try {
            const sequelizeService = await SequelizeService.get();
            const rooms = await sequelizeService.roomService.findAllRooms();
            if (!rooms) {
                res.status(404);
                throw new Error("Rooms not found");
            }
            res.status(200).json(rooms);
            return;
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /api/rooms/{id}:
     *   put:
     *     summary: Update room
     *     tags: [Rooms]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               capacity:
     *                 type: integer
     *               managerId:
     *                 type: integer
     *     responses:
     *       200:
     *         description: Room updated successfully
     *       400:
     *         description: Bad request
     *       404:
     *         description: Room not found
     */
    async updateRoom(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const idSchema = z.number().positive().int();
            const roomSchema = z.object({
                name: z.string().min(3).max(50).optional(),
                capacity: z.number().positive().int().optional(),
                managerId: z.number().positive().int().optional(),
            });

            if (!id || !idSchema.safeParse(id).success || !roomSchema.safeParse(req.body).success) {
                res.status(400);
                throw new Error("Invalid room data");
            }

            const sequelizeService = await SequelizeService.get();
            const room = await sequelizeService.roomService.updateRoomById(id, req.body);

            if (!room) {
                res.status(404);
                throw new Error("Room not found");
            }

            res.status(200).json(room);
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
     * /api/rooms/{id}:
     *   delete:
     *     summary: Delete room
     *     tags: [Rooms]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Room deleted successfully
     *       404:
     *         description: Room not found
     */
    async deleteRoom(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const idSchema = z.number().positive().int();

            if (!id || !idSchema.safeParse(id).success) {
                res.status(400);
                throw new Error("Invalid room ID");
            }

            const sequelizeService = await SequelizeService.get();
            const result = await sequelizeService.roomService.deleteRoomById(id);

            if (!result) {
                res.status(404);
                throw new Error("Room not found");
            }

            res.status(200).json({ message: "Room deleted successfully" });
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
            validateRole.bind(this, ["ROLE_USER", "ROLE_ADMIN"]),
            this.getRoom.bind(this)
        );
        router.get(
            "/",
            authenticateToken,
            validateRole.bind(this, ["ROLE_USER", "ROLE_ADMIN"]),
            this.getAllRooms.bind(this)
        );
        router.post(
            "/",
            authenticateToken,
            validateRole.bind(this, ["ROLE_ADMIN"]),
            this.createRoom.bind(this)
        );
        router.put(
            "/:id",
            authenticateToken,
            validateRole.bind(this, ["ROLE_ADMIN"]),
            this.updateRoom.bind(this)
        );
        router.delete(
            "/:id",
            authenticateToken,
            validateRole.bind(this, ["ROLE_ADMIN"]),
            this.deleteRoom.bind(this)
        );
        return router;
    }
}
