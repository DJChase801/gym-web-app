"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPurchasesController = void 0;
const models_1 = __importDefault(require("../models"));
// Controller function that gets all the members from the database
const getAllPurchasesController = () => {
    const purchases = models_1.default.purchase.findAll();
    return purchases;
};
exports.getAllPurchasesController = getAllPurchasesController;
