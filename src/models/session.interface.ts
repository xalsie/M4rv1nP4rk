import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { User } from "./user.interface";

export class Session extends Model<InferAttributes<Session>, InferCreationAttributes<Session>> {
    declare id: CreationOptional<number>;
    declare expirationDate: Date | null;
    declare userAgent: string;
    declare user: string | User;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}
