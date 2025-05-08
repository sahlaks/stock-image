"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoutes_1 = __importDefault(require("../../presentation/routes/userRoutes"));
dotenv_1.default.config();
const createServer = () => {
    try {
        const app = (0, express_1.default)();
        const corsOptions = {
            origin: "https://pic-cloud-psi.vercel.app",
            credentials: true,
            methods: "GET,PUT,PATCH,POST,DELETE",
            allowedHeaders: "Content-Type,Authorization",
        };
        // Apply CORS middleware
        app.use((0, cors_1.default)(corsOptions));
        app.use((0, cookie_parser_1.default)());
        app.use((0, express_session_1.default)({
            secret: "your_secret_key",
            resave: false,
            saveUninitialized: true,
            cookie: { secure: true },
        }));
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use('/api', userRoutes_1.default);
        app.get('/', (req, res) => {
            res.send('Welcome to the PicCloud API!');
        });
        //error middleware
        app.use((err, req, res, next) => {
            console.error(err.stack);
            const statusCode = err.statusCode || 500;
            const message = err.message || "Internal server error!";
            res.status(statusCode).json({
                success: false,
                message: message,
            });
        });
        return app;
    }
    catch (error) {
        console.log(error);
    }
};
exports.default = createServer;
