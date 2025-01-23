import { Model, ModelStatic } from "sequelize";
import { SequelizeService } from "./sequelize.service";
import { Session } from "../../models";
import { sessionSchema } from "./schema";
import { z } from "zod";

export class SessionService {
    readonly sequelizeService: SequelizeService;
    readonly model: ModelStatic<Model<Session>>;

    constructor(sequelizeService: SequelizeService) {
        this.sequelizeService = sequelizeService;
        const sequelize = this.sequelizeService.sequelize;
        const schema = new sessionSchema(sequelize);
        this.model = sequelize.models.User;

        this.model.sync()
    }

    async createSession(session: Session): Promise<Model<Session>> {
        const res = await this.model.create(session);
        return res;
    }

    async findActiveSession(id: string): Promise<Model<Session> | null> {
        const res = await this.model.findOne({
            where: {
                id: id,
                expirationDate: {
                    $gt: new Date()
                }
            },
            include: "user"
        })

        return res;
    }

    async increaseExpirationDate(id: number): Promise<[affectedCount: number, affectedRows: Model<Session, Session>[]] | null> {
        const res = await this.model.update({
            expirationDate: new Date((new Date().getTime()) + 1_296_000_000)
        }, {
            where: {
                id: id
            },
            returning: true
        });

        return res;
    }
}
