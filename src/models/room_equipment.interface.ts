import { Model } from "sequelize";
import { Room } from "./room.interface";
import { Equipment } from "./equipment.interface";

export interface IRoomEquipment {
    id: number;
    roomId: number;
    equipmentId: number;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
    Room?: Room;
    Equipment?: Equipment;
}

export type RoomEquipmentCreation = Omit<IRoomEquipment, 'id' | 'createdAt' | 'updatedAt'>;

export class RoomEquipment extends Model<IRoomEquipment, RoomEquipmentCreation> {
    declare id: number;
    declare roomId: number;
    declare equipmentId: number;
    declare quantity: number;
    declare createdAt: Date;
    declare updatedAt: Date;
    declare Room: Room;
    declare Equipment: Equipment;
}
