import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  ModelStatic
} from "sequelize";
import { User } from "../../models";
import { SequelizeService } from "./sequelize.service";
import { userSchema } from "./schema";

// import { AddressService } from "./address.service";

export type CreateUser = Omit<User, "_id" | "createdAt" | "updatedAt">;
export type UpdateUser = Omit<User, "_id" | "createdAt" | "updatedAt">;

export type IUser = Omit<User, "password">;

export class UserService {
  readonly sequelizeService: SequelizeService;
  // readonly model: Model<InferAttributes<User>, InferCreationAttributes<User>>;
  readonly model: ModelStatic<Model<any, any>>;

  constructor(sequelizeService: SequelizeService) {
    this.sequelizeService = sequelizeService;
    const sequelize = this.sequelizeService.sequelize;
    const schema = new userSchema(sequelize);
    this.model = sequelize.models.User;
  }

  // // register
  // async createUser(user: CreateUser): Promise<IUser> {
  //   const res = await this.model.create(user);
  //   return res;
  // }

  // // login
  // async findUser(email: string): Promise<IUser | null> {
  //   const user = await this.model.findOne({
  //     email: email,
  //   });

  //   return user;
  // }

  // // read one
  // async findUserById(id: string): Promise<IUser | null> {
  //   const user = await this.model.findById(id);

  //   return user;
  // }

  // // read all
  // async findAllUsers(): Promise<IUser[]> {
  //   const users = await this.model.find();

  //   return users;
  // }

  // // update
  // async updateUser(id: string, update: Partial<User>): Promise<IUser | null> {
  //   return this.model.findByIdAndUpdate(id, update, { new: true });
  // }

  // // delete
  // async deleteUser(id: string): Promise<IUser | null> {
  //   const res = await this.model.findByIdAndUpdate(
  //     id,
  //     {
  //       $set: {
  //         name: "Anonyme",
  //         email: `${id}@deleted.com`,
  //         password: "deleted",
  //       }
  //     },
  //     {
  //       new: true,
  //       runValidators: true,
  //     }
  //   );

  //   return res;
  // }
}
