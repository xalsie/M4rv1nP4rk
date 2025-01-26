import { Sequelize, DataTypes } from "sequelize";
import { User, UserRoom, Room } from "../../../models";

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
