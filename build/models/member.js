"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const _1 = require(".");
class Member extends sequelize_1.Model {
    static associate(models) {
        Member.hasMany(models.purchase, { foreignKey: models.purchase.primaryKeyAttribute });
    }
    static initialize(sequelize) {
        Member.init({
            member_id: {
                allowNull: false,
                primaryKey: true,
                type: sequelize_1.DataTypes.UUID,
                defaultValue: sequelize_1.DataTypes.UUIDV4,
            },
            first_name: {
                allowNull: false,
                type: sequelize_1.DataTypes.TEXT,
            },
            last_name: {
                allowNull: false,
                type: sequelize_1.DataTypes.TEXT,
            },
            full_name: {
                allowNull: false,
                type: sequelize_1.DataTypes.TEXT,
            },
        }, {
            sequelize,
            modelName: 'member',
            ..._1.sharedSequelizeOptions,
        });
        return Member;
    }
}
exports.default = Member;
