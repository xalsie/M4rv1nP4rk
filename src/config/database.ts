import { SequelizeService } from "../services/sequelize/sequelize.service";
import logger from "./logger";

const database = async () => {
  const sequelize = await SequelizeService.get();

  sequelize.sequelize
  .authenticate().then(() => {
    logger.info('Connection has been established successfully.');
  }).catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
};

export default database;
