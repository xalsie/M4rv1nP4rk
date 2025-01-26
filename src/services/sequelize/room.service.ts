import { Model, ModelStatic, Op } from "sequelize";
import { SequelizeService } from "./sequelize.service";
import { Room, RoomCreation } from "../../models";
import { roomSchema } from "./schema";

export class RoomService {
    readonly sequelizeService: SequelizeService;
    readonly model: ModelStatic<Model<Room, RoomCreation>>;

    constructor(sequelizeService: SequelizeService) {
        this.sequelizeService = sequelizeService;
        const sequelize = this.sequelizeService.sequelize;
        const schema = new roomSchema(sequelize);
        this.model = sequelize.models.Room;

        this.model.sync()
    }

    async createRoom(roomBody: any): Promise<Room | null> {
        const room = await this.model.create(roomBody);
        return room?.dataValues || null;
    }

    async findRoomById(id: number): Promise<Room | null> {
        const room = await this.model.findByPk(id);

        return room?.dataValues || null;
    }

    async findAllRooms(): Promise<Room[]> {
        const rooms = await this.model.findAll();

        return rooms.map(room => room.dataValues);
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
