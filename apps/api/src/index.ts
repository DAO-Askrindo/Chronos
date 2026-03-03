import express from 'express';
import { createServer } from 'http';
import { initSocket } from './utils/socket';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import parameterRoutes from './routes/parameter.routes';
import workflowRoutes from './routes/workflow.routes';
import taskRoutes from './routes/task.routes';
import meetingRoutes from './routes/meeting.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/parameters', parameterRoutes);
app.use('/api/v1/workflows', workflowRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/meetings', meetingRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running', timestamp: new Date() });
});

const server = createServer(app);
initSocket(server);

server.listen(port, () => {
  console.log(`🚀 Chronos API Server running on port ${port}`);
});
