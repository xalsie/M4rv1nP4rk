import { Model, ModelStatic, InferAttributes, InferCreationAttributes } from "sequelize";
import { SequelizeService } from "./sequelize.service";
import { User, UserCreation } from "../../models";
import { userSchema } from "./schema";

export class UserService {
    readonly sequelizeService: SequelizeService;
    readonly model: ModelStatic<Model<User, UserCreation>>;

    constructor(sequelizeService: SequelizeService) {
        this.sequelizeService = sequelizeService;
        const sequelize = this.sequelizeService.sequelize;
        const schema = new userSchema(sequelize);
        this.model = sequelize.models.User;

        this.model.sync()
    }

    // register
    async createUser(user: UserCreation): Promise<User> {
        const res = await this.model.create(user, {
            returning: true
        });

        return res.dataValues;
    }

    // login
    async findUser(email: string): Promise<User | null> {
        const user = await this.model.scope("withPassword").findOne({
            where: {
                email: email,
            }
        });

        return user?.dataValues || null;
    }

    // read one
    async findUserById(id: string): Promise<User | null> {
        const user = await this.model.findByPk(id);

        return user?.dataValues || null;
    }

    // read all
    async findAllUsers(): Promise<User[]> {
        const users = await this.model.findAll();

        return users.map(user => user.dataValues);
    }

    // update
    async updateUser(id: number, update: Partial<User>): Promise<User | null> {
        const res = await this.model.update(update, {
            where: {
                id: id,
            },
            returning: true,
        });

        return res.length ? res[1][0].dataValues : null;
    }

    // delete
    async deleteUser(id: number): Promise<number> {
        const res = await this.model.destroy({
            where: {
                id: id,
            }
        });

        return res;
    }

    // verify email
    async findUserByVerificationToken(token: string): Promise<User | null> {
        const user = await this.model.findOne({
            where: {
                emailVerificationToken: token
            }
        });

        return user?.dataValues || null;
    }

    async findUserByResetToken(token: string): Promise<User | null> {
        const user = await this.model.findOne({
            where: {
                resetPasswordToken: token
            }
        });

        return user?.dataValues || null;
    }
}
