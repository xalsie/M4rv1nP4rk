import { Model } from "sequelize";

export interface IRoom {
    id: number;
    name: string;
    capacity: number;
    managerId: number;
    createdAt: Date;
    updatedAt: Date;
}

export type RoomCreation = Omit<IRoom, 'id' | 'createdAt' | 'updatedAt'>;

export class Room extends Model<IRoom, RoomCreation> {
    declare id: number;
    declare name: string;
    declare capacity: number;
    declare managerId: number;
    declare createdAt: Date;
    declare updatedAt: Date;
}
