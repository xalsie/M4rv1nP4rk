import { Sequelize, DataTypes } from "sequelize";
import { User, Session } from "../../../models";

/**
 * @swagger
 * components:
 *   schemas:
 *     Session:
 *       type: object
 *       required:
 *         - userAgent
 *         - user
 *       properties:
 *         expirationDate:
 *           type: string
 *           format: date-time
 *           description: La date d'expiration de la session.
 *         userAgent:
 *           type: string
 *           description: L'agent utilisateur.
 *         user:
 *           type: string
 *           description: L'identifiant de l'utilisateur.
 *       example:
 *         userAgent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36
 *         user: 5f4f6d7e5e5c5b5a5a4a5a5a5a
 */

export class sessionSchema {
  constructor(sequelize: Sequelize) {
    Session.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      expirationDate: {
        type: DataTypes.DATE,
      },
      userAgent: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user: {
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
      modelName: "Session",
      timestamps: true,
      underscored: true
    });

    Session.belongsTo(User, {
      foreignKey: "user",
      targetKey: "id",
      as: "user",
    });

    Session.sync().then(() => {
      console.log("Table des sessions synchronisée");
    });

    return Session;
  }
}
