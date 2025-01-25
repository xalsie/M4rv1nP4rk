import { Sequelize, DataTypes } from "sequelize";
import { User, Session } from "../../../models";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstname
 *         - lastName
 *         - email
 *         - password
 *       properties:
 *         firstname:
 *           type: string
 *           description: Le nom de l'utilisateur
 *         lastName:
 *           type: string
 *           description: Le prénom de l'utilisateur
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
 *       example:
 *         firstname: John
 *         lastName: Doe
 *         email: john.doe@toto.com
 *         tel: 0102030405
 *         password: password
 *         role: ROLE_USER
 */

export class userSchema {
  constructor(sequelize: Sequelize) {
    User.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
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
        type: DataTypes.ENUM("ROLE_USER", "ROLE_ADMIN"),
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
      tableName: 'users',
      timestamps: true,
      defaultScope: {
        attributes: {
          exclude: ['password']
        },
        order: [['id', 'ASC']]
      },
      scopes: {
        withPassword: {
          attributes: {
            include: ['password']
          }
        }
      }
    });

    // User.hasMany(Session, {
    //   foreignKey: 'user',
    //   sourceKey: 'id'
    // });

    User.sync().then(() => {
      console.log('Table des utilisateurs synchronisée');
    });

    return User;
  }
}
