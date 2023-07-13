"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const members_1 = require("../../services/members");
const router = express_1.default.Router();
// Route to get all the members from the database
router.route('/get-members-list')
    .get(getAllMembersController); // call the controller function
async function getAllMembersController(req, res) {
    const members = (0, members_1.getMembers)(); // call the service function
    res.send({ success: true, message: 'Successfully fetched all members', data: { members } });
}
// export the router
exports.default = router;
