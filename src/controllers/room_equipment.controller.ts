import { NextFunction, Request, Response, Router } from "express";
import { authenticateToken } from "../middlewares/jwt";
import { validateRole } from "../middlewares";
import { SequelizeService } from "../services/sequelize/sequelize.service";
import { z } from "zod";

export class RoomEquipmentController {
    /**
     * @swagger
     * /api/room-equipments:
     *   post:
     *     summary: Associate equipment to a room
     *     tags: [RoomEquipments]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - roomId
     *               - equipmentId
     *             properties:
     *               roomId:
     *                 type: integer
     *                 description: ID of the room
     *               equipmentId:
     *                 type: integer
     *                 description: ID of the equipment
     *     responses:
     *       201:
     *         description: Equipment associated to room successfully
     *       400:
     *         description: Bad request
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     */
    async createRoomEquipment(req: Request, res: Response, next: NextFunction) {
        try {
            const roomEquipmentSchema = z.object({
                roomId: z.number().positive().int(),
                equipmentId: z.number().positive().int()
            });

            if (!req.body || !roomEquipmentSchema.safeParse(req.body).success) {
                res.status(400);
                throw new Error("Invalid room-equipment data");
            }

            const sequelizeService = await SequelizeService.get();
            const roomEquipment = await sequelizeService.roomEquipmentService.createRoomEquipment(req.body);

            res.status(201).json(roomEquipment);
            return;
        } catch (error) {
            if (!res.statusCode) res.status(500);
            next(error);
        }
    }

    /**
     * @swagger
     * /api/room-equipments/room/{roomId}:
     *   get:
     *     summary: Get all equipment in a room
     *     tags: [RoomEquipments]
     *     parameters:
     *       - in: path
     *         name: roomId
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: List of equipment in room
     *       404:
     *         description: No equipment found
     */
    async getEquipmentsByRoom(req: Request, res: Response, next: NextFunction) {
        try {
            const roomId = parseInt(req.params.roomId);
            const idSchema = z.number().positive().int();

            if (!roomId || !idSchema.safeParse(roomId).success) {
                res.status(400);
                throw new Error("Invalid room ID");
            }

            const sequelizeService = await SequelizeService.get();
            const equipments = await sequelizeService.roomEquipmentService.findEquipmentsByRoomId(roomId);

            if (!equipments) {
                res.status(404);
                throw new Error("No equipment found in this room");
            }

            res.status(200).json(equipments);
            return;
        } catch (error) {
            if (!res.statusCode) res.status(500);
            next(error);
        }
    }

    /**
     * @swagger
     * /api/room-equipments/equipment/{equipmentId}:
     *   get:
     *     summary: Get all rooms containing specific equipment
     *     tags: [RoomEquipments]
     *     parameters:
     *       - in: path
     *         name: equipmentId
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: List of rooms containing equipment
     *       404:
     *         description: Equipment not found in any room
     */
    async getRoomsByEquipment(req: Request, res: Response, next: NextFunction) {
        try {
            const equipmentId = parseInt(req.params.equipmentId);
            const idSchema = z.number().positive().int();

            if (!equipmentId || !idSchema.safeParse(equipmentId).success) {
                res.status(400);
                throw new Error("Invalid equipment ID");
            }

            const sequelizeService = await SequelizeService.get();
            const rooms = await sequelizeService.roomEquipmentService.findRoomsByEquipmentId(equipmentId);

            if (!rooms) {
                res.status(404);
                throw new Error("Equipment not found in any room");
            }

            res.status(200).json(rooms);
            return;
        } catch (error) {
            if (!res.statusCode) res.status(500);
            next(error);
        }
    }

    /**
     * @swagger
     * /api/room-equipments/{id}:
     *   delete:
     *     summary: Remove equipment from room
     *     tags: [RoomEquipments]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Equipment removed from room successfully
     *       404:
     *         description: Association not found
     */
    async deleteRoomEquipment(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const idSchema = z.number().positive().int();

            if (!id || !idSchema.safeParse(id).success) {
                res.status(400);
                throw new Error("Invalid ID");
            }

            const sequelizeService = await SequelizeService.get();
            const result = await sequelizeService.roomEquipmentService.deleteRoomEquipment(id);

            if (!result) {
                res.status(404);
                throw new Error("Room-Equipment association not found");
            }

            res.status(200).json({ message: "Equipment removed from room successfully" });
            return;
        } catch (error) {
            if (!res.statusCode) res.status(500);
            next(error);
        }
    }

    buildRouter(): Router {
        const router = Router();
        router.post(
            "/",
            authenticateToken,
            validateRole.bind(this, ["ROLE_ADMIN"]),
            this.createRoomEquipment.bind(this)
        );
        router.get(
            "/room/:roomId",
            authenticateToken,
            validateRole.bind(this, ["ROLE_USER", "ROLE_ADMIN"]),
            this.getEquipmentsByRoom.bind(this)
        );
        router.get(
            "/equipment/:equipmentId",
            authenticateToken,
            validateRole.bind(this, ["ROLE_USER", "ROLE_ADMIN"]),
            this.getRoomsByEquipment.bind(this)
        );
        router.delete(
            "/:id",
            authenticateToken,
            validateRole.bind(this, ["ROLE_ADMIN"]),
            this.deleteRoomEquipment.bind(this)
        );
        return router;
    }
}
