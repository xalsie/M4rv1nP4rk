import { Model, ModelStatic, Op } from "sequelize";
import { SequelizeService } from "./sequelize.service";
import { Room, RoomCreation, Equipment, RoomEquipment } from "../../models";
import {
    roomSchema,
    equipmentSchema,
    roomEquipmentSchema,
} from "./schema";

export class RoomService {
    readonly sequelizeService: SequelizeService;
    readonly model: ModelStatic<Model<Room, RoomCreation>>;
    readonly equipmentModel: ModelStatic<Model<Equipment>>;
    readonly roomEquipmentModel: ModelStatic<Model<RoomEquipment>>;

    constructor(sequelizeService: SequelizeService) {
        this.sequelizeService = sequelizeService;
        const sequelize = this.sequelizeService.sequelize;
        const schema = new roomSchema(sequelize);
        this.model = sequelize.models.Room;

        const equipmentSchemaInstance = new equipmentSchema(sequelize);
        const roomEquipmentSchemaInstance = new roomEquipmentSchema(sequelize);

        this.roomEquipmentModel = sequelize.models.RoomEquipment;
        this.equipmentModel = sequelize.models.Equipment;

        this.equipmentModel.hasMany(this.roomEquipmentModel, {
            foreignKey: 'equipmentId',
            as: 'roomEquipments'
        });

        this.roomEquipmentModel.belongsTo(this.equipmentModel, {
            foreignKey: 'equipmentId',
            targetKey: 'id'
        });

        this.model.sync()
    }

    async createRoom(roomBody: any): Promise<Room | null> {
        const room = await this.model.create(roomBody);
        return room?.dataValues || null;
    }

    async findRoomById(id: number): Promise<Room | null> {
        const roomEquipment: any = await this.roomEquipmentModel.findAll({
            where: {
                roomId: id
            },
            include: [{
                model: Equipment,
                attributes: ['id', 'name', 'description', 'status', 'serialNumber', 'createdAt', 'updatedAt']
            }, {
                model: Room,
                attributes: ['id', 'name', 'capacity', 'managerId', 'createdAt', 'updatedAt']
            }]
        });

        const roomData: Room = roomEquipment.map((roomEquip: any) => {
            return {
                id: roomEquip.dataValues.Room.dataValues.id,
                name: roomEquip.dataValues.Room.dataValues.name,
                capacity: roomEquip.dataValues.Room.dataValues.capacity,
                managerId: roomEquip.dataValues.Room.dataValues.managerId,
                equipments: roomEquip.dataValues.Equipment,
                createdAt: roomEquip.dataValues.Room.dataValues.createdAt,
                updatedAt: roomEquip.dataValues.Room.dataValues.updatedAt
            }
        });

        return roomData || null;
    }

    async findAllRooms(): Promise<Room[]> {
        const roomEquipment: any
            = await this.roomEquipmentModel.findAll({
            include: [{
                model: Equipment,
                attributes: ['id', 'name', 'description', 'status', 'serialNumber', 'createdAt', 'updatedAt']
            }, {
                model: Room,
                attributes: ['id', 'name', 'capacity', 'managerId', 'createdAt', 'updatedAt']
            }]
        });

        const roomData: Room[] = [];

        roomData.push(roomEquipment.map((roomEquip: any) => {
            return {
                id: roomEquip.dataValues.Room.dataValues.id,
                name: roomEquip.dataValues.Room.dataValues.name,
                capacity: roomEquip.dataValues.Room.dataValues.capacity,
                managerId: roomEquip.dataValues.Room.dataValues.managerId,
                equipments: roomEquip.dataValues.Equipment,
                createdAt: roomEquip.dataValues.Room.dataValues.createdAt,
                updatedAt: roomEquip.dataValues.Room.dataValues.updatedAt
            }
        }));

        return roomData;
    }

    async updateRoomById(id: number, updateBody: any): Promise<Room | null> {
        const room = await this.model.update(updateBody, {
            where: {
                id: id,
            },
            returning: true,
        });

        return room[1][0]?.dataValues || null;
    }

    async deleteRoomById(id: number): Promise<number> {
        const res = await this.model.destroy({
            where: {
                id: id,
            }
        });

        return res;
    }
}
