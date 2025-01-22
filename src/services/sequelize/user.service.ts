import {
  Model,
  ModelStatic
} from "sequelize";
import { User } from "../../models";
import { SequelizeService } from "./sequelize.service";
import { userSchema } from "./schema";

export type CreateUser = Omit<User, "id" | "createdAt" | "updatedAt">;
export type UpdateUser = Omit<User, "id" | "createdAt" | "updatedAt">;

export class UserService {
  readonly sequelizeService: SequelizeService;
  readonly model: ModelStatic<Model<User>>;

  constructor(sequelizeService: SequelizeService) {
    this.sequelizeService = sequelizeService;
    const sequelize = this.sequelizeService.sequelize;
    const schema = new userSchema(sequelize);
    this.model = sequelize.models.User;

    this.model.sync()
  }

  // register
  async createUser(user: User): Promise<Model<User>> {
    const res = await this.model.create(user);
    return res;
  }

  // login
  async findUser(email: string): Promise<Model<User> | null> {
    const user = await this.model.scope("withPassword").findOne({
      where: {
        email: email,
      },
    });

    return user;
  }

  // read one
  async findUserById(id: string): Promise<Model<User> | null> {
    const user = await this.model.findByPk(id);

    return user;
  }

  // read all
  async findAllUsers(): Promise<Model<User>[]> {
    const users = await this.model.findAll();

    return users;
  }

  // update
  async updateUser(id: string, update: Partial<User>): Promise<Model<User> | null> {
    const res = await this.model.update(update, {
      where: {
        id: id,
      },
      returning: true,
    });

    return res[1][0];
  }

  // delete
  async deleteUser(id: string): Promise<number> {
    const res = await this.model.destroy({
      where: {
        id: id,
      }
    });

    return res;
  }
}
