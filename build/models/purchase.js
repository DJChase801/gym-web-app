"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const _1 = require(".");
class Purchase extends sequelize_1.Model {
    static associate(models) {
        Purchase.belongsTo(models.member, { foreignKey: 'member_id' });
        Purchase.belongsTo(models.product, { foreignKey: 'product_id' });
    }
    static initialize(sequelize) {
        Purchase.init({
            purchase_id: {
                allowNull: false,
                primaryKey: true,
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
            },
            member_id: {
                allowNull: false,
                type: sequelize_1.DataTypes.UUID,
            },
            product_id: {
                allowNull: false,
                type: sequelize_1.DataTypes.UUID,
            },
            quantity: {
                allowNull: false,
                type: sequelize_1.DataTypes.INTEGER,
            },
            total_price: {
                allowNull: false,
                type: sequelize_1.DataTypes.DOUBLE,
            },
            charge_when: {
                allowNull: false,
                type: sequelize_1.DataTypes.DATE,
            },
        }, {
            sequelize,
            modelName: 'purchase',
            ..._1.sharedSequelizeOptions,
        });
        return Purchase;
    }
}
exports.default = Purchase;
