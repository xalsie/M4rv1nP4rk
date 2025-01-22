import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { Timestamps } from "./timestamps.interface";

// export interface User extends Timestamps {
//   id: number;
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   role?: string;
//   tel: string;
//   isEmailVerified: boolean;
//   emailVerificationToken?: string | null;
//   emailVerificationTokenExpires?: Date | null;
//   resetPasswordToken?: string;
//   resetPasswordExpires?: Date;
// }

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare password: string;
  declare role: string;
  declare tel: string;
  declare isEmailVerified: boolean;
  declare emailVerificationToken: string | null;
  declare emailVerificationTokenExpires: Date | null;
  declare resetPasswordToken: string | null;
  declare resetPasswordExpires: Date | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}
