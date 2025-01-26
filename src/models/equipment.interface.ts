import { Model } from "sequelize";

export interface IEquipment {
    id: number;
    name: string;
    description: string;
    status: string;
    serialNumber: string;
    createdAt: Date;
    updatedAt: Date;
}

export type EquipmentCreation = Omit<IEquipment, 'id' | 'createdAt' | 'updatedAt'>;

export class Equipment extends Model<IEquipment, EquipmentCreation> {
    declare id: number;
    declare name: string;
    declare description: string;
    declare status: string;
    declare serialNumber: string;
    declare createdAt: Date;
    declare updatedAt: Date;
}
