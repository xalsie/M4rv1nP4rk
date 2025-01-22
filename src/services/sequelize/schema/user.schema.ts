import { Sequelize, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { User } from "../../../models";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: Le nom de l'utilisateur
 *         email:
 *           type: string
 *           description: L'email de l'utilisateur
 *         tel:
 *           type: string
 *           description: telephone de l'utilisateur
 *         password:
 *           type: string
 *           description: Le mot de passe de l'utilisateur
 *         role:
 *           type: string
 *           enum: [ROLE_USER, ROLE_STORE_KEEPER, ROLE_ADMIN, ROLE_COMPTA]
 *           default: ROLE_USER
 *           description: Le rôle de l'utilisateur
 *         address:
 *           $ref: '#/components/schemas/Address'
 *           description: L'adresse de l'utilisateur
 *       example:
 *         name: John Doe
 *         email: john.doe@toto.com
 *         tel: 0102030405
 *         password: password
 *         role: ROLE_USER
 *         address:
 *           userId: "643d0fd5c07b4a2e88b074c9"
 *           street: "123 Rue de Paris"
 *           city: "Paris"
 *           postalCode: "75000"
 *           country: "France"
 */

export class userSchema {
  constructor(sequelize: Sequelize) {
    User.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("ROLE_USER", "ROLE_STORE_KEEPER", "ROLE_ADMIN", "ROLE_COMPTA"),
        defaultValue: "ROLE_USER",
      },
      tel: {
        type: DataTypes.STRING,
        unique: true,
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      emailVerificationToken: {
        type: DataTypes.STRING,
        defaultValue: null
      },
      emailVerificationTokenExpires: {
        type: DataTypes.DATE,
        defaultValue: null
      },
      resetPasswordToken: {
        type: DataTypes.STRING,
        defaultValue: null
      },
      resetPasswordExpires: {
        type: DataTypes.DATE,
        defaultValue: null
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
      modelName: 'User',
      timestamps: true
    });

    // return sequelize.models.User;
    return User;
  }
}
