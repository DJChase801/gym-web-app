"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMembers = void 0;
const models_1 = __importDefault(require("../models"));
// Controller function that gets all the members from the database
const getMembers = async () => {
    const members = await models_1.default.member.findAll();
    return members;
};
exports.getMembers = getMembers;
