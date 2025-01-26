import { Sequelize, DataTypes } from "sequelize";
import { User, UserRoom, Room } from "../../../models";

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRoom:
 *       type: object
 *       required:
 *         - userId
 *         - roomId
 *         - role
 *       properties:
 *         userId:
 *           type: integer
 *           description: The ID of the user
 *         roomId:
 *           type: integer
 *           description: The ID of the room
 *         role:
 *           type: string
 *           enum: ['OWNER', 'MEMBER', 'ADMIN']
 *           description: The role of the user in the room
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

export class userRoomSchema {
    constructor(sequelize: Sequelize) {
        UserRoom.init({
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            roomId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Rooms',
                    key: 'id'
                }
            },
            role: {
                type: DataTypes.ENUM('OWNER', 'MEMBER', 'ADMIN'),
                allowNull: false
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
            tableName: 'UserRooms',
            timestamps: true
        });

        UserRoom.belongsTo(User, {
            foreignKey: 'userId',
            targetKey: 'id'
        });

        // UserRoom.belongsTo(Room, {
        //     foreignKey: 'roomId',
        //     targetKey: 'id'
        // });

        UserRoom.sync().then(() => {
            console.log('UserRoom table created');
        });

        return UserRoom;
    }
}
