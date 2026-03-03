"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRSVP = exports.createMeeting = exports.getMeetings = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const getMeetings = async (req, res) => {
    try {
        const tenantId = req.activeTenantId;
        const userId = req.user.id;
        const { start, end } = req.query; // Date range for calendar
        const whereClause = { tenantId };
        // Ideally, filter by meetings the user is invited to or is part of a project they have access to.
        // For MVP Calendar view, we filter by date range if provided
        if (start && end) {
            whereClause.startTime = { gte: new Date(start) };
            whereClause.endTime = { lte: new Date(end) };
        }
        const meetings = await prisma_1.default.meeting.findMany({
            where: whereClause,
            include: {
                linkedProject: { select: { id: true, name: true, key: true } },
                linkedTask: { select: { id: true, title: true, issueKey: true } },
                attendees: {
                    include: {
                        user: { select: { id: true, name: true, email: true } }
                    }
                }
            },
            orderBy: { startTime: 'asc' }
        });
        return res.json({ data: meetings });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.getMeetings = getMeetings;
const createMeeting = async (req, res) => {
    try {
        const tenantId = req.activeTenantId;
        const { title, description, startTime, endTime, location, meetingUrl, linkedProjectId, linkedTaskId, attendeeIds } = req.body;
        const meeting = await prisma_1.default.meeting.create({
            data: {
                tenantId,
                title,
                description,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                location,
                meetingUrl,
                linkedProjectId,
                linkedTaskId,
                attendees: {
                    create: (attendeeIds || []).map((userId) => ({
                        userId,
                        rsvpStatus: 'pending' // default status
                    }))
                }
            },
            include: { attendees: true }
        });
        return res.status(201).json({ data: meeting });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.createMeeting = createMeeting;
const updateRSVP = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params; // meeting id
        const { rsvpStatus } = req.body; // 'accepted', 'declined', 'tentative'
        const rsvp = await prisma_1.default.meetingAttendee.update({
            where: {
                meetingId_userId: {
                    meetingId: id,
                    userId: userId
                }
            },
            data: { rsvpStatus }
        });
        return res.json({ data: rsvp });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.updateRSVP = updateRSVP;
