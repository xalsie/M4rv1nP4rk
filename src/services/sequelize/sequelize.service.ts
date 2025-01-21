import { db_host, db_port, db_driver, db_name, db_user, db_password } from "../../config";
import { Sequelize, Dialect } from "sequelize";
// import { UserService } from "./user.service";
// import { SessionService } from "./session.service";

export class SequelizeService {
  private static instance?: SequelizeService;

  readonly sequelize: Sequelize;
  // readonly userService: UserService;
  // readonly sessionService: SessionService;

  private constructor(sequelize: Sequelize) {
    this.sequelize = sequelize;
    // this.userService = new UserService(this);
    // this.sessionService = new SessionService(this);
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
    const connection = new Sequelize(db_name, db_user, db_password, {
      host: db_host,
      port: db_port,
      dialect: db_driver as Dialect
    });

    return connection;
  }
}
