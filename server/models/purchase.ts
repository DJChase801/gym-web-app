import { DataTypes, Sequelize, Model } from 'sequelize';
import Models, { sharedSequelizeOptions } from '.';

export interface ModelAttributes {
    purchase_id: string;
    member_id: string;
    product_id: string;
    quantity: number;
    total_price: number;
}

export default class Purchase extends Model<ModelAttributes> implements ModelAttributes {
    static associate(models: typeof Models): void {
        Purchase.belongsTo(models.member, { foreignKey: 'member_id' });
        Purchase.belongsTo(models.product, { foreignKey: 'product_id' });
    }

    // attributes
    declare purchase_id: string;
    declare member_id: string;
    declare product_id: string;
    declare quantity: number;
    declare total_price: number;
    declare charge_when: Date;

    // timestamps
    declare created_at: Date;
    declare updated_at: Date;
    declare deleted_at: Date;

    static initialize(sequelize: Sequelize): typeof Purchase {
        Purchase.init({
            purchase_id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            member_id: {
                allowNull: false,
                type: DataTypes.UUID,
            },
            product_id: {
                allowNull: false,
                type: DataTypes.UUID,
            },
            quantity: {
                allowNull: false,
                type: DataTypes.INTEGER,
            },
            total_price: {
                allowNull: false,
                type: DataTypes.DOUBLE,
            },
        }, {
            sequelize,
            modelName: 'purchase',
            ...sharedSequelizeOptions,
        });
    
        return Purchase;
    }
}
