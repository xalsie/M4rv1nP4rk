import { NextFunction, Request, Response, Router } from "express";
import { authenticateToken } from "../middlewares/jwt";
import { validateRole } from "../middlewares";
import { SequelizeService } from "../services/sequelize/sequelize.service";
import { z } from "zod";

export class EquipmentController {
    /**
     * @swagger
     * /api/equipments:
     *   post:
     *     summary: Create a new equipment
     *     tags: [Equipments]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *               - description
     *               - status
     *               - serialNumber 
     *             properties:
     *               name:
     *                 type: string
     *                 description: Name of the equipment
     *               description:
     *                 type: string
     *                 description: Description of the equipment
     *               status:
     *                 type: string
     *                 description: Status of the equipment
     *               serialNumber:
     *                 type: string
     *                 description: Serial number of the equipment
     *             example:
     *               name: "Tapis de course"
     *               description: "Tapis de course professionnel"
     *               status: "DISPONIBLE"
     *               serialNumber: "123456789"
     *     responses:
     *       201:
     *         description: Equipment created successfully
     *       400:
     *         description: Bad request
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     */
    async createEquipment(req: Request, res: Response, next: NextFunction) {
        try {
            const equipmentSchema = z.object({
                name: z.string().min(3).max(50),
                description: z.string().min(3).max(255),
                roomId: z.number().positive().int(),
            });

            if (!req.body || !equipmentSchema.safeParse(req.body).success) {
                res.status(400);
                throw new Error("Invalid equipment data");
            }

            const sequelizeService = await SequelizeService.get();
            const equipment = await sequelizeService.equipmentService.createEquipment(req.body);

            res.status(201).json(equipment);
            return;
        } catch (error) {
            if (!res.statusCode) res.status(500);
            next(error);
        }
    }

    /**
     * @swagger
     * /api/equipments/{id}:
     *   get:
     *     summary: Get equipment by ID
     *     tags: [Equipments]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Equipment found
     *       404:
     *         description: Equipment not found
     */
    async getEquipment(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const idSchema = z.number().positive().int();

            if (!id || !idSchema.safeParse(id).success) {
                res.status(400);
                throw new Error("Invalid equipment ID");
            }

            const sequelizeService = await SequelizeService.get();
            const equipment = await sequelizeService.equipmentService.findEquipmentById(id);

            if (!equipment) {
                res.status(404);
                throw new Error("Equipment not found");
            }

            res.status(200).json(equipment);
            return;
        } catch (error) {
            if (!res.statusCode) res.status(500);
            next(error);
        }
    }

    /**
     * @swagger
     * /api/equipments:
     *   get:
     *     summary: Get all equipments
     *     tags: [Equipments]
     *     responses:
     *       200:
     *         description: List of equipments
     *       404:
     *         description: No equipments found
     */
    async getAllEquipments(req: Request, res: Response, next: NextFunction) {
        try {
            const sequelizeService = await SequelizeService.get();
            const equipments = await sequelizeService.equipmentService.findAllEquipments();
            
            if (!equipments) {
                res.status(404);
                throw new Error("No equipments found");
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
     * /api/equipments/{id}:
     *   put:
     *     summary: Update equipment
     *     tags: [Equipments]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               description:
     *                 type: string
     *     responses:
     *       200:
     *         description: Equipment updated successfully
     *       404:
     *         description: Equipment not found
     */
    async updateEquipment(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const idSchema = z.number().positive().int();
            const equipmentSchema = z.object({
                name: z.string().min(3).max(50).optional(),
                description: z.string().min(3).max(255).optional(),
                roomId: z.number().positive().int().optional(),
            });

            if (!id || !idSchema.safeParse(id).success || !equipmentSchema.safeParse(req.body).success) {
                res.status(400);
                throw new Error("Invalid equipment data");
            }

            const sequelizeService = await SequelizeService.get();
            const equipment = await sequelizeService.equipmentService.updateEquipment(id, req.body);

            if (!equipment) {
                res.status(404);
                throw new Error("Equipment not found");
            }

            res.status(200).json(equipment);
            return;
        } catch (error) {
            if (!res.statusCode) res.status(500);
            next(error);
        }
    }

    /**
     * @swagger
     * /api/equipments/{id}:
     *   delete:
     *     summary: Delete equipment
     *     tags: [Equipments]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Equipment deleted successfully
     *       404:
     *         description: Equipment not found
     */
    async deleteEquipment(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            const idSchema = z.number().positive().int();

            if (!id || !idSchema.safeParse(id).success) {
                res.status(400);
                throw new Error("Invalid equipment ID");
            }

            const sequelizeService = await SequelizeService.get();
            const result = await sequelizeService.equipmentService.deleteEquipment(id);

            if (!result) {
                res.status(404);
                throw new Error("Equipment not found");
            }

            res.status(200).json({ message: "Equipment deleted successfully" });
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
            this.createEquipment.bind(this)
        );
        router.get(
            "/:id",
            authenticateToken,
            validateRole.bind(this, ["ROLE_USER", "ROLE_ADMIN"]),
            this.getEquipment.bind(this)
        );
        router.get(
            "/",
            authenticateToken,
            validateRole.bind(this, ["ROLE_USER", "ROLE_ADMIN"]),
            this.getAllEquipments.bind(this)
        );
        router.put(
            "/:id",
            authenticateToken,
            validateRole.bind(this, ["ROLE_ADMIN"]),
            this.updateEquipment.bind(this)
        );
        router.delete(
            "/:id",
            authenticateToken,
            validateRole.bind(this, ["ROLE_ADMIN"]),
            this.deleteEquipment.bind(this)
        );
        return router;
    }
}
