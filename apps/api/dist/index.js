"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_1 = require("./utils/socket");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const project_routes_1 = __importDefault(require("./routes/project.routes"));
const parameter_routes_1 = __importDefault(require("./routes/parameter.routes"));
const workflow_routes_1 = __importDefault(require("./routes/workflow.routes"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
const meeting_routes_1 = __importDefault(require("./routes/meeting.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/projects', project_routes_1.default);
app.use('/api/v1/parameters', parameter_routes_1.default);
app.use('/api/v1/workflows', workflow_routes_1.default);
app.use('/api/v1/tasks', task_routes_1.default);
app.use('/api/v1/meetings', meeting_routes_1.default);
app.get('/api/health', (req, res) => {
    res.json({ status: 'API is running', timestamp: new Date() });
});
const server = (0, http_1.createServer)(app);
(0, socket_1.initSocket)(server);
server.listen(port, () => {
    console.log(`🚀 Chronos API Server running on port ${port}`);
});
