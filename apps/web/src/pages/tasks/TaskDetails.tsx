import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import apiClient from '@/lib/axios';

export default function TaskDetails() {
    const { projectId, taskId } = useParams<{ projectId: string; taskId: string }>();
    const [task, setTask] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Example of parameterized custom data parsing
    const [customData, setCustomData] = useState<Record<string, any>>({});

    useEffect(() => {
        // In a real app, you would fetch exactly this task by ID
        // For this demonstration foundation, we simulate finding the task from the general list
        const fetchTask = async () => {
            try {
                const response = await apiClient.get('/tasks', { params: { projectId } });
                const found = response.data.data.find((t: any) => t.id === taskId);
                setTask(found);
                setCustomData(found?.customData || {});
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTask();
    }, [projectId, taskId]);

    if (isLoading) return <div className="p-8">Loading task details...</div>;
    if (!task) return <div className="p-8">Task not found</div>;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Badge variant="outline" className="text-sm">
                        {task.issueKey}
                    </Badge>
                    <h1 className="text-3xl font-bold tracking-tight">{task.title}</h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary">Edit Details</Button>
                    <Button>Save Changes</Button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground whitespace-pre-wrap">
                                {task.description || 'No description provided.'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Custom Fields (Parameterized JSONB)</CardTitle>
                            <CardDescription>
                                Fields below are dynamically driven by the Multi-Tenant Engine parameters.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Simulating dynamic field rendering from JSONB */}
                            {Object.keys(customData).length === 0 ? (
                                <p className="text-muted-foreground text-sm">No custom parameters applied yet.</p>
                            ) : (
                                Object.entries(customData).map(([key, value]) => (
                                    <div key={key} className="space-y-2">
                                        <Label className="capitalize">{key.replace('_', ' ')}</Label>
                                        <Input
                                            readOnly
                                            defaultValue={String(value)}
                                            className="bg-muted/50"
                                        />
                                    </div>
                                ))
                            )}

                            {/* Example of adding a new field interactively */}
                            <div className="pt-4 border-t border-border mt-4">
                                <p className="text-sm font-medium mb-3">Add Custom Field</p>
                                <div className="flex gap-2">
                                    <Input placeholder="Field Name (e.g. Budget)" />
                                    <Input placeholder="Value" />
                                    <Button variant="outline">Add</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Properties</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Status</Label>
                                <div className="font-medium">{task.state?.name || 'Unknown'}</div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Priority</Label>
                                <div className="font-medium">{task.priority?.label || 'Unprioritized'}</div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Type</Label>
                                <div className="font-medium">{task.type?.label || 'General Task'}</div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Assignee</Label>
                                <div className="font-medium">{task.assignee?.name || 'Unassigned'}</div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Version</Label>
                                <div className="font-medium text-xs">{task.version}</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
