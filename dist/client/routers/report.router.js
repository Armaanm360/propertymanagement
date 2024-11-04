"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_router_1 = __importDefault(require("../../abstract/abstract.router"));
const member_validator_1 = __importDefault(require("../utils/validators/member.validator"));
const team_controller_1 = __importDefault(require("../controllers/team.controller"));
class MemberReportRouter extends abstract_router_1.default {
    constructor() {
        super();
        this.validator = new member_validator_1.default();
        this.TeamController = new team_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        this.router
            .route('/')
            .get(this.TeamController.getTeam);
    }
}
exports.default = MemberReportRouter;
