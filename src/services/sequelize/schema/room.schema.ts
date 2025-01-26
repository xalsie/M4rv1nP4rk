import { Sequelize, DataTypes } from "sequelize";
import { User, Room, Equipment, RoomEquipment } from "../../../models";

/**
 * @swagger
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       required:
 *         - name
 *         - capacity
 *       properties:
 *         name:
 *           type: string
 *           description: Le nom de la salle
 *         capacity:
 *           type: integer
 *           description: La capacité maximale de la salle
 *         managerId:
 *           type: integer
 *           description: L'identifiant du manager de la salle
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         name: Salle A101
 *         capacity: 30
 *         managerId: 1
 *         createdAt: 2021-09-01T00:00:00.000Z
 *         updatedAt: 2021-09-01T00:00:00.000Z
 */

export class roomSchema {
    constructor(sequelize: Sequelize) {
        Room.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            capacity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            managerId: {
                type: DataTypes.INTEGER,
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
            modelName: 'Room',
            tableName: 'rooms',
            timestamps: true
        });

        Room.belongsTo(User, {
            foreignKey: 'managerId',
            targetKey: 'id'
        });

        // Room.belongsToMany(Equipment, {
        //     through: RoomEquipment,
        //     foreignKey: 'roomId',
        //     otherKey: 'equipmentId'
        // });



        // has many equipments
        // Room.hasMany(Equipment, {
        //     foreignKey: 'roomId',
        //     sourceKey: 'id'
        // });

        // has many characteristics
        // Room.hasMany(Characteristic, {
        //     foreignKey: 'roomId',
        //     sourceKey: 'id'
        // });

        // has many exercise types
        // Room.hasMany(ExerciseType, {
        //     foreignKey: 'roomId',
        //     sourceKey: 'id'
        // });

        Room.sync().then(() => {
            console.log('Table des salles synchronisée');
        });

        return Room;
    }
}
