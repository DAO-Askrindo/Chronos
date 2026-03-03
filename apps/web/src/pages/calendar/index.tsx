import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import type { View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card, CardContent } from '@/components/ui/card';
import apiClient from '@/lib/axios';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

interface MeetingEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    linkedProject?: { name: string; key: string };
    linkedTask?: { title: string; issueKey: string };
}

export default function CalendarView() {
    const [events, setEvents] = useState<MeetingEvent[]>([]);
    const [view, setView] = useState<View>('month');
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const response = await apiClient.get('/meetings');
                const formattedEvents = response.data.data.map((m: any) => ({
                    id: m.id,
                    title: m.title,
                    start: new Date(m.startTime),
                    end: new Date(m.endTime),
                    linkedProject: m.linkedProject,
                    linkedTask: m.linkedTask,
                }));
                setEvents(formattedEvents);
            } catch (error) {
                console.error('Failed to fetch meetings:', error);
            }
        };
        fetchMeetings();
    }, []);

    const EventComponent = ({ event }: { event: MeetingEvent }) => {
        return (
            <div className="flex flex-col gap-1 overflow-hidden p-1">
                <span className="font-semibold text-xs leading-tight block">{event.title}</span>
                {event.linkedProject && (
                    <Badge variant="secondary" className="text-[10px] truncate max-w-full">
                        {event.linkedProject.key}
                    </Badge>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6 h-full flex flex-col pt-2 pb-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Unified Calendar</h1>
                    <p className="text-muted-foreground mt-1">
                        Master view for Smart Meetings, RSVPs, and Timeline Milestones.
                    </p>
                </div>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Meeting
                </Button>
            </div>

            <Card className="flex-1 shadow-sm border overflow-hidden min-h-[600px]">
                <CardContent className="p-4 h-full">
                    {/* We override some internal react-big-calendar styles using global css later if needed */}
                    <div className="h-full bg-card rounded-md">
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: '100%' }}
                            view={view}
                            onView={(newView) => setView(newView)}
                            date={date}
                            onNavigate={(newDate) => setDate(newDate)}
                            components={{
                                event: EventComponent
                            }}
                            className="font-sans"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
