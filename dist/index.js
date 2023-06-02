"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const router_1 = require("./router/router");
const errorHandler_1 = require("./utils/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    methods: ["HEAD", "OPTIONS", "POST", "GET", "PUT", "PATCH", "DELETE"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Uppy-Versions",
        "Accept",
        "x-requested-with",
        "Access-Control-Allow-Origin",
    ],
    exposedHeaders: [
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Origin",
    ],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use('/', router_1.router);
app.use(errorHandler_1.errorHandler);
app.listen(process.env.PORT || 5000, () => {
    console.log(`Server has been started on http://localhost:${process.env.PORT || 5000}...`);
});
