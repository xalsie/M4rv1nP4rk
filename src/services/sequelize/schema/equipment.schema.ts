import { Sequelize, DataTypes } from "sequelize";
import { Equipment, Room } from "../../../models";

/**
 * @swagger
 * components:
 *   schemas:
 *     Equipment:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - status
 *         - serialNumber
 *       properties:
 *         name:
 *           type: string
 *           description: Le nom de l'équipement
 *         description:
 *           type: string
 *           description: La description de l'équipement
 *         status:
 *           type: string
 *           description: Le statut de l'équipement
 *         serialNumber:
 *           type: string
 *           description: Le numéro de série de l'équipement
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         name: Tapis de course
 *         description: Tapis de course professionnel
 *         status: OK
 *         serialNumber: 123456789
 *         createdAt: 2021-09-01T00:00:00.000Z
 *         updatedAt: 2021-09-01T00:00:00.000Z
 */

export class equipmentSchema {
    constructor(sequelize: Sequelize) {
        Equipment.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            serialNumber: {
                type: DataTypes.STRING,
                allowNull: false,
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
            modelName: 'Equipment',
            tableName: 'equipments',
            timestamps: true
        });

        // Equipment.belongsToMany(Room, {
        //     through: 'RoomEquipment',
        //     foreignKey: 'equipmentId',
        //     otherKey: 'roomId'
        // });

        Equipment.belongsTo(Room, {
            foreignKey: 'roomId',
            targetKey: 'id'
        });

        Equipment.sync().then(() => {
            console.log('Table des équipements synchronisée');
        });

        return Equipment;
    }
}
