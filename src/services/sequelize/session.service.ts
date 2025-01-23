import { Model, ModelStatic } from "sequelize";
import { SequelizeService } from "./sequelize.service";
import { Session, SessionCreation } from "../../models";
import { sessionSchema } from "./schema";
import { z } from "zod";

export class SessionService {
    readonly sequelizeService: SequelizeService;
    readonly model: ModelStatic<Model<Session, SessionCreation>>;

    constructor(sequelizeService: SequelizeService) {
        this.sequelizeService = sequelizeService;
        const sequelize = this.sequelizeService.sequelize;
        const schema = new sessionSchema(sequelize);
        this.model = sequelize.models.User;

        this.model.sync()
    }

    async createSession(session: Session): Promise<Session> {
        const res = await this.model.create(session);
        return res.dataValues
    }

    async findActiveSession(id: string): Promise<Session | null> {
        const res = await this.model.findOne({
            where: {
                id: id,
                expirationDate: {
                    $gt: new Date()
                }
            },
            include: "user"
        })

        return res?.dataValues || null;
    }

    async increaseExpirationDate(id: number): Promise<Session | null> {
        const res = await this.model.update({
            expirationDate: new Date((new Date().getTime()) + 1_296_000_000)
        }, {
            where: {
                id: id
            },
            returning: true
        });

        return res ? res[1][0].dataValues : null;
    }
}
