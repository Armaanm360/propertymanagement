"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const property_router_1 = __importDefault(require("./routers/property.router"));
/**
 * AgentRouter class that initializes and configures the router for
 * handling agent-specific routes, particularly for managing properties.
 */
class AgentRouter {
    /**
     * Constructor that sets up the router by calling the router configuration method.
     */
    constructor() {
        this.router = (0, express_1.Router)(); // Express Router for handling agent routes
        this.callRouter();
    }
    /**
     * Configures the agent router by defining specific routes and
     * associating them with the corresponding router instances.
     */
    callRouter() {
        // Route for managing agent properties
        this.router.use('/properties', new property_router_1.default().router);
    }
}
exports.default = AgentRouter;
