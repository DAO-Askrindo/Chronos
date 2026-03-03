import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import prisma from '../utils/prisma';

export const getMeetings = async (req: AuthRequest, res: Response) => {
    try {
        const tenantId = req.activeTenantId!;
        const userId = req.user!.id;
        const { start, end } = req.query; // Date range for calendar

        const whereClause: any = { tenantId };

        // Ideally, filter by meetings the user is invited to or is part of a project they have access to.

        // For MVP Calendar view, we filter by date range if provided
        if (start && end) {
            whereClause.startTime = { gte: new Date(start as string) };
            whereClause.endTime = { lte: new Date(end as string) };
        }

        const meetings = await prisma.meeting.findMany({
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
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const createMeeting = async (req: AuthRequest, res: Response) => {
    try {
        const tenantId = req.activeTenantId!;
        const { title, description, startTime, endTime, location, meetingUrl, linkedProjectId, linkedTaskId, attendeeIds } = req.body;

        const meeting = await prisma.meeting.create({
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
                    create: (attendeeIds || []).map((userId: string) => ({
                        userId,
                        rsvpStatus: 'pending' // default status
                    }))
                }
            },
            include: { attendees: true }
        });

        return res.status(201).json({ data: meeting });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const updateRSVP = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const { id } = req.params; // meeting id
        const { rsvpStatus } = req.body; // 'accepted', 'declined', 'tentative'

        const rsvp = await prisma.meetingAttendee.update({
            where: {
                meetingId_userId: {
                    meetingId: id as string,
                    userId: userId
                }
            },
            data: { rsvpStatus }
        });

        return res.json({ data: rsvp });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};
