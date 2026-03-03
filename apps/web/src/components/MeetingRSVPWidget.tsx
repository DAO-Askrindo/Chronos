import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import apiClient from '@/lib/axios';

interface MeetingInviteProps {
    meeting: {
        id: string;
        title: string;
        startTime: string;
        endTime: string;
        location?: string;
        linkedProject?: { name: string; key: string };
    };
    initialStatus: 'pending' | 'accepted' | 'declined' | 'tentative';
    onStatusChange?: () => void;
}

export function MeetingRSVPWidget({ meeting, initialStatus, onStatusChange }: MeetingInviteProps) {
    const [status, setStatus] = useState(initialStatus);
    const [isLoading, setIsLoading] = useState(false);

    const handleRSVP = async (newStatus: 'accepted' | 'declined' | 'tentative') => {
        setIsLoading(true);
        try {
            await apiClient.patch(`/meetings/${meeting.id}/rsvp`, { rsvpStatus: newStatus });
            setStatus(newStatus);
            if (onStatusChange) onStatusChange();
        } catch (error) {
            console.error('Failed to update RSVP:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusBadge = () => {
        switch (status) {
            case 'accepted': return <Badge className="bg-green-500">Going</Badge>;
            case 'declined': return <Badge variant="destructive">Declined</Badge>;
            case 'tentative': return <Badge variant="secondary">Tentative</Badge>;
            default: return <Badge variant="outline">Pending RSVP</Badge>;
        }
    };

    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-lg leading-tight">{meeting.title}</CardTitle>
                    {getStatusBadge()}
                </div>
                {meeting.linkedProject && (
                    <p className="text-xs text-muted-foreground">
                        Project: <span className="font-semibold">{meeting.linkedProject.key}</span>
                    </p>
                )}
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>{format(new Date(meeting.startTime), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>
                        {format(new Date(meeting.startTime), 'h:mm a')} - {format(new Date(meeting.endTime), 'h:mm a')}
                    </span>
                </div>
                {meeting.location && (
                    <div className="flex items-center text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span className="truncate">{meeting.location}</span>
                    </div>
                )}
            </CardContent>
            {status === 'pending' && (
                <CardFooter className="pt-2 flex gap-2">
                    <Button variant="default" className="flex-1" size="sm" onClick={() => handleRSVP('accepted')} disabled={isLoading}>
                        Accept
                    </Button>
                    <Button variant="secondary" className="flex-1" size="sm" onClick={() => handleRSVP('tentative')} disabled={isLoading}>
                        Maybe
                    </Button>
                    <Button variant="outline" className="flex-1" size="sm" onClick={() => handleRSVP('declined')} disabled={isLoading}>
                        Decline
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}
