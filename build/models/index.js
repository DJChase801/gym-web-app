"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = exports.sharedSequelizeOptions = void 0;
const sequelize_1 = require("sequelize");
const db_json_1 = __importDefault(require("../config/db.json"));
const member_1 = __importDefault(require("./member"));
const purchase_1 = __importDefault(require("./purchase"));
const product_1 = __importDefault(require("./product"));
const models = {
    member: member_1.default,
    purchase: purchase_1.default,
    product: product_1.default,
};
exports.sharedSequelizeOptions = {
    underscored: true,
    paranoid: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
};
const env = process.env.NODE_ENV || 'development';
const config = db_json_1.default[env];
    config.define = { freezeTableName: true };
exports.sequelize = new sequelize_1.Sequelize(config);
for (const model of Object.values(models)) {
    model.initialize(exports.sequelize);
}
for (const model of Object.values(models)) {
    if ('associate' in model)
        model.associate(models);
}
exports.default = models;
