"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const _1 = require(".");
class Product extends sequelize_1.Model {
    static associate(models) {
        Product.belongsToMany(models.purchase, { through: 'product_id', foreignKey: models.purchase.primaryKeyAttribute });
    }
    static initialize(sequelize) {
        Product.init({
            product_id: {
                allowNull: false,
                primaryKey: true,
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
            },
            name: {
                allowNull: false,
                type: sequelize_1.DataTypes.TEXT,
            },
            price: {
                allowNull: false,
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
            },
            img_url: {
                allowNull: false,
                type: sequelize_1.DataTypes.TEXT,
            },
        }, {
            sequelize,
            modelName: 'product',
            ..._1.sharedSequelizeOptions,
        });
        return Product;
    }
}
exports.default = Product;
