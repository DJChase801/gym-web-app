import { Sequelize } from 'sequelize';
import Member from './member';
import Purchase from './purchase';
import Product from './product';

const configs = {
	development: {
		"username": "postgres",
		"password": "4674537Pn!",
		"database": "ute_db",
		"host": "localhost",
		"dialect": "postgres"
	},
	production: {
		"username": "danchase801",
		"password": "4674537Pn!",
		"database": "postgres",
		"host": "ute-cx-postgres.cxwibztx6pcq.us-west-2.rds.amazonaws.com",
		"dialect": "postgres"
	}
};

const models = {
	member: Member,
	purchase: Purchase,
	product: Product,
};

export const sharedSequelizeOptions = {
	underscored: true,
	paranoid: true,
	timestamps: true,
	createdAt: 'created_at',
	updatedAt: 'updated_at',
	deletedAt: 'deleted_at',
};

const env: string = process.env.NODE_ENV || 'development';
const config: Record<any, any> = (configs as any)[env];
config.define = { freezeTableName: true };
export const sequelize = new Sequelize(config);

for (const model of Object.values(models)) {
	model.initialize(sequelize);
}

for (const model of Object.values(models)) {
	if ('associate' in model) model.associate(models);
}

export default models;