import { Model, ModelStatic } from "sequelize";
import { SequelizeService } from "./sequelize.service";
import { RoomEquipment, RoomEquipmentCreation } from "../../models";
import { roomEquipmentSchema } from "./schema";

export class RoomEquipmentService {
    readonly sequelizeService: SequelizeService;
    readonly model: ModelStatic<Model<RoomEquipment, RoomEquipmentCreation>>;

    constructor(sequelizeService: SequelizeService) {
        this.sequelizeService = sequelizeService;
        const sequelize = this.sequelizeService.sequelize;
        const schema = new roomEquipmentSchema(sequelize);
        this.model = sequelize.models.RoomEquipment;

        this.model.sync()
    }

    async createRoomEquipment(roomEquipmentBody: RoomEquipmentCreation): Promise<RoomEquipment | null> {
        const roomEquipment = await this.model.create(roomEquipmentBody);
        return roomEquipment?.dataValues || null;
    }

    async findRoomEquipmentById(id: number): Promise<RoomEquipment | null> {
        const roomEquipment = await this.model.findByPk(id);
        return roomEquipment?.dataValues || null;
    }

    async findAllRoomEquipments(): Promise<RoomEquipment[]> {
        const roomEquipments = await this.model.findAll();
        return roomEquipments.map(roomEquipment => roomEquipment.dataValues);
    }

    async findEquipmentsByRoomId(roomId: number): Promise<RoomEquipment[]> {
        const roomEquipments = await this.model.findAll({
            where: {
                roomId: roomId
            }
        });
        return roomEquipments.map(roomEquipment => roomEquipment.dataValues);
    }

    async findRoomsByEquipmentId(equipmentId: number): Promise<RoomEquipment[]> {
        const roomEquipments = await this.model.findAll({
            where: {
                equipmentId: equipmentId
            }
        });
        return roomEquipments.map(roomEquipment => roomEquipment.dataValues);
    }

    async updateRoomEquipment(id: number, updateBody: Partial<RoomEquipment>): Promise<RoomEquipment | null> {
        const roomEquipment = await this.model.update(updateBody, {
            where: {
                id: id
            },
            returning: true
        });
        return roomEquipment[1][0]?.dataValues || null;
    }

    async deleteRoomEquipment(id: number): Promise<number> {
        return await this.model.destroy({
            where: {
                id: id
            }
        });
    }

    async deleteRoomEquipmentByRoomId(roomId: number): Promise<number> {
        return await this.model.destroy({
            where: {
                roomId: roomId
            }
        });
    }

    async deleteRoomEquipmentByEquipmentId(equipmentId: number): Promise<number> {
        return await this.model.destroy({
            where: {
                equipmentId: equipmentId
            }
        });
    }
}
