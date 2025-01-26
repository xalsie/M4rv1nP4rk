import { Sequelize, DataTypes } from "sequelize";
import { RoomEquipment, Room, Equipment } from "../../../models";

/**
 * @swagger
 * components:
 *   schemas:
 *     RoomEquipment:
 *       type: object
 *       required:
 *         - roomId
 *         - equipmentId
 *         - quantity
 *       properties:
 *         roomId:
 *           type: integer
 *           description: The ID of the room
 *         equipmentId:
 *           type: integer
 *           description: The ID of the equipment
 *         quantity:
 *           type: integer
 *           description: The quantity of the equipment
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         roomId: 1
 *         equipmentId: 1
 *         quantity: 2
 *         createdAt: 2021-09-01T00:00:00.000Z
 *         updatedAt: 2021-09-01T00:00:00.000Z
 */

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
                    model: 'equipments',
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

        RoomEquipment.belongsTo(Room, {
            foreignKey: 'roomId',
            targetKey: 'id'
        });

        RoomEquipment.belongsTo(Equipment, {
            foreignKey: 'equipmentId',
            targetKey: 'id'
        });

        RoomEquipment.sync().then(() => {
            console.log('Table des associations salle-équipement synchronisée');
        });

        return RoomEquipment;
    }
}
