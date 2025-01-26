import { env } from "../../env";
import { Sequelize, Dialect } from "sequelize";
import { UserService } from "./user.service";
import { SessionService } from "./session.service";
import { RoomService } from "./room.service";

export class SequelizeService {
  private static instance?: SequelizeService;

  readonly sequelize: Sequelize;
  readonly userService: UserService;
  readonly sessionService: SessionService;
  readonly roomService: RoomService;

  private constructor(sequelize: Sequelize) {
    this.sequelize = sequelize;
    this.userService = new UserService(this);
    this.sessionService = new SessionService(this);
    this.roomService = new RoomService(this);
  }

  public static async get(): Promise<SequelizeService> {
    if (this.instance !== undefined) {
      return this.instance;
    }
    const connection = await this.openConnection();
    this.instance = new SequelizeService(connection);
    return this.instance;
  }

  private static async openConnection(): Promise<Sequelize> {
    const connection = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
      host: env.DB_HOST,
      port: env.DB_PORT,
      dialect: env.DB_DRIVER as Dialect,
    });

    return connection;
  }
}
