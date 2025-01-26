import { Model } from "sequelize";

export interface IUserRoom {
    id: number;
    userId: number;
    roomId: number;
    role: string; // OWNER, MEMBER, ADMIN
    createdAt: Date;
    updatedAt: Date;
}

export type UserRoomCreation = Omit<IUserRoom, 'id' | 'createdAt' | 'updatedAt'>;

export class UserRoom extends Model<IUserRoom, UserRoomCreation> {
    declare id: number;
    declare userId: number;
    declare roomId: number;
    declare role: string;
    declare createdAt: Date;
    declare updatedAt: Date;
}
