import { Optional, CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { User } from "./user.interface";

export interface ISession {
    id: number;
    expirationDate: Date | null;
    userAgent: string;
    user: string | User;
    createdAt: Date;
    updatedAt: Date;
}

export type SessionCreation = Omit<ISession, 'id' | 'createdAt' | 'updatedAt'>;

export class Session extends Model<ISession, SessionCreation> {
    declare id: number;
    declare expirationDate: Date | null;
    declare userAgent: string;
    declare user: string | User;
    declare createdAt: Date;
    declare updatedAt: Date;
}
