import { Model } from "sequelize";

export interface IRoomEquipment {
    id: number;
    roomId: number;
    equipmentId: number;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
}

export type RoomEquipmentCreation = Omit<IRoomEquipment, 'id' | 'createdAt' | 'updatedAt'>;

export class RoomEquipment extends Model<IRoomEquipment, RoomEquipmentCreation> {
    declare id: number;
    declare roomId: number;
    declare equipmentId: number;
    declare quantity: number;
    declare createdAt: Date;
    declare updatedAt: Date;
}
