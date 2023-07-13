import { DataTypes, Sequelize, Model } from 'sequelize';
import Models, { sharedSequelizeOptions } from '.';

export interface ModelAttributes {
	member_id: string; 
    first_name: string;
    last_name: string;
    full_name: string;
}

export default class Member extends Model<ModelAttributes> implements ModelAttributes {
	static associate(models: typeof Models): void {
		Member.hasMany(models.purchase, { foreignKey: models.purchase.primaryKeyAttribute });
	}

	// attributes
	declare member_id: string;
    declare first_name: string;
    declare last_name: string;
    declare full_name: string;

	// timestamps
	declare created_at: Date;
	declare updated_at: Date;
	declare deleted_at: Date;

	static initialize(sequelize: Sequelize): typeof Member {
		Member.init({
			member_id: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
			},
			first_name: {
				allowNull: false,
				type: DataTypes.TEXT,
			},
			last_name: {
				allowNull: false,
				type: DataTypes.TEXT,
			},
			full_name: {
                allowNull: false,
                type: DataTypes.TEXT,
            },
		}, {
			sequelize,
			modelName: 'member',
			...sharedSequelizeOptions,
		});
	
		return Member;
	}
}