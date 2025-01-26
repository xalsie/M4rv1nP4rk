import { Sequelize, DataTypes } from "sequelize";
import { RoomEquipment } from "../../../models";

export class roomEquipmentSchema {
    constructor(sequelize: Sequelize) {
        RoomEquipment.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            roomId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'rooms',
                    key: 'id'
                }
            },
            equipmentId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'equipment',
                    key: 'id'
                }
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: new Date()
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: new Date()
            }
        }, {
            sequelize,
            modelName: 'RoomEquipment',
            tableName: 'room_equipment',
            timestamps: true
        });

        RoomEquipment.sync().then(() => {
            console.log('Table des associations salle-équipement synchronisée');
        });

        return RoomEquipment;
    }
}
