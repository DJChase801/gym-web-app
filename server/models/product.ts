import { DataTypes, Sequelize, Model } from 'sequelize';
import Models, { sharedSequelizeOptions } from '.';

export interface ModelAttributes {
	product_id: string;
    name: string;
    price: number;
    img_url: string;
}

export default class Product extends Model<ModelAttributes> implements ModelAttributes {
	static associate(models: typeof Models): void {
		Product.belongsToMany(models.purchase, { through: 'product_id', foreignKey: models.purchase.primaryKeyAttribute });
	}

	// attributes
	declare product_id: string;
    declare name: string;
    declare price: number;
    declare img_url: string;

	// timestamps
	declare created_at: Date;
	declare updated_at: Date;
	declare deleted_at: Date;

	static initialize(sequelize: Sequelize): typeof Product {
		Product.init({
			product_id: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
			},
            name: {
                allowNull: false,
                type: DataTypes.TEXT,
            },
            price: {
                allowNull: false,
                type: DataTypes.DECIMAL(10, 2),
            },
            img_url: {
                allowNull: false,
                type: DataTypes.TEXT,
            },
		}, {
			sequelize,
			modelName: 'product',
			...sharedSequelizeOptions,
		});
	
		return Product;
	}
}