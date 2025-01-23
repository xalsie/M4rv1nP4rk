import { Optional, CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  tel: string;
  isEmailVerified: boolean;
  emailVerificationToken: string | null;
  emailVerificationTokenExpires: Date | null;
  resetPasswordToken: string | null;
  resetPasswordExpires: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// export type UserCreation = Optional<IUser, 'id' | 'createdAt' | 'updatedAt'>;
export type UserCreation = Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>;

export class User extends Model<IUser, UserCreation> {
  // export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: number;
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
  declare createdAt: Date;
  declare updatedAt: Date;
}
