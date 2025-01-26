import { Model, ModelStatic } from "sequelize";
import { SequelizeService } from "./sequelize.service";
import { Equipment, EquipmentCreation } from "../../models";
import { equipmentSchema } from "./schema";

export class EquipmentService {
    readonly sequelizeService: SequelizeService;
    readonly model: ModelStatic<Model<Equipment, EquipmentCreation>>;

    constructor(sequelizeService: SequelizeService) {
        this.sequelizeService = sequelizeService;
        const sequelize = this.sequelizeService.sequelize;
        const schema = new equipmentSchema(sequelize);
        this.model = sequelize.models.Equipment;

        this.model.sync()
    }

    async createEquipment(equipmentBody: any): Promise<Equipment | null> {
        const equipment = await this.model.create(equipmentBody);
        return equipment?.dataValues || null;
    }

    async findEquipmentById(id: number): Promise<Equipment | null> {
        const equipment = await this.model.findByPk(id);
        return equipment?.dataValues || null;
    }

    async findEquipmentBySerialNumber(serialNumber: string): Promise<Equipment | null> {
        const equipment = await this.model.findOne({
            where: {
                serialNumber: serialNumber,
            }
        });

        return equipment?.dataValues || null;
    }

    async findAllEquipments(): Promise<Equipment[]> {
        const equipments = await this.model.findAll();
        return equipments.map(equipment => equipment.dataValues);
    }

    async updateEquipment(id: number, updateBody: any): Promise<Equipment | null> {
        const equipment = await this.model.update(updateBody, {
            where: {
                id: id,
            },
            returning: true,
        });

        return equipment[1][0]?.dataValues || null;
    }

    async deleteEquipment(id: number): Promise<number> {
        const res = await this.model.destroy({
            where: {
                id: id,
            }
        });

        return res;
    }
}
