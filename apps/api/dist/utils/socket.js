"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
let io;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: '*', // For development, in production use actual domain
            methods: ['GET', 'POST', 'PATCH']
        }
    });
    io.on('connection', (socket) => {
        console.log(`[Socket] Client connected: ${socket.id}`);
        // Allow clients to join specific project rooms for targeted updates
        socket.on('join_project', (projectId) => {
            socket.join(`project_${projectId}`);
            console.log(`[Socket] Client ${socket.id} joined project_${projectId}`);
        });
        socket.on('leave_project', (projectId) => {
            socket.leave(`project_${projectId}`);
        });
        socket.on('disconnect', () => {
            console.log(`[Socket] Client disconnected: ${socket.id}`);
        });
    });
    return io;
};
exports.initSocket = initSocket;
const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};
exports.getIO = getIO;
