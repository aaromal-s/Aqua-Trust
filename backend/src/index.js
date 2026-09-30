"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
// Import Routes
const sensorRoutes_1 = __importDefault(require("./routes/sensorRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const alertRoutes_1 = __importDefault(require("./routes/alertRoutes"));
const locationRoutes_1 = __importDefault(require("./routes/locationRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// API Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/sensors', sensorRoutes_1.default);
app.use('/api/alerts', alertRoutes_1.default);
app.use('/api/locations', locationRoutes_1.default);
// Root Status Route
app.get('/api/status', (req, res) => {
    res.json({ status: 'online', service: 'Aqua Trust Core API' });
});
// Database Connection and Server Start
const startServer = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/aqua-trust';
        console.log(`Connecting to MongoDB...`);
        await mongoose_1.default.connect(mongoUri);
        console.log(`MongoDB Connected Successfully`);
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error(`Error connecting to MongoDB:`, error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map