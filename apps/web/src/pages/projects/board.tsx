import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { useParams } from 'react-router-dom';
import apiClient from '@/lib/axios';
import { io } from 'socket.io-client';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface StateColumn {
    id: string;
    name: string;
    orderIdx: number;
}

interface TaskItem {
    id: string;
    title: string;
    issueKey: string;
    stateId: string;
    priority?: { color?: string; label?: string };
    assignee?: { name: string };
    weight: number;
}

export default function KanbanBoard() {
    const { projectId } = useParams<{ projectId: string }>();
    const [columns, setColumns] = useState<StateColumn[]>([]);
    const [tasks, setTasks] = useState<TaskItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Optimistic UI updates
    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        // Find Task and Update State
        const taskIndex = tasks.findIndex(t => t.id === draggableId);
        if (taskIndex === -1) return;

        // Optimistic Update
        const oldStateId = tasks[taskIndex].stateId;
        const newTasks = [...tasks];
        newTasks[taskIndex].stateId = destination.droppableId;
        setTasks(newTasks);

        try {
            await apiClient.patch(`/tasks/${draggableId}/state`, { newStateId: destination.droppableId });
        } catch (error) {
            console.error('Failed to move task:', error);
            // Revert on failure
            newTasks[taskIndex].stateId = oldStateId;
            setTasks(newTasks);
        }
    };

    useEffect(() => {
        // Ideally use Promise.all to fetch columns and tasks
        const fetchData = async () => {
            try {
                const wfResponse = await apiClient.get('/workflows');
                setColumns(wfResponse.data.data);

                const tasksResponse = await apiClient.get(`/tasks`, { params: { projectId } });
                setTasks(tasksResponse.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();

        // WebSocket initialization
        const URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:3001';
        const socket = io(URL);

        socket.on('connect', () => {
            console.log('Connected to realtime sync');
            socket.emit('join_project', projectId);
        });

        socket.on('task_updated', (updatedTask: TaskItem) => {
            setTasks(currentTasks => {
                const index = currentTasks.findIndex(t => t.id === updatedTask.id);
                if (index === -1) return currentTasks; // Task not in current view
                const newTasks = [...currentTasks];
                newTasks[index] = { ...newTasks[index], ...updatedTask };
                return newTasks;
            });
        });

        return () => {
            socket.emit('leave_project', projectId);
            socket.disconnect();
        };
    }, [projectId]);

    if (isLoading) return <div className="p-8 text-center">Loading board...</div>;

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="mb-6 flex justify-between items-center pr-6">
                <h1 className="text-2xl font-bold">Project Board</h1>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-6 overflow-x-auto pb-4 flex-1 items-start">
                    {columns.map((col) => (
                        <div key={col.id} className="flex flex-col bg-muted/50 rounded-lg shrink-0 w-80 max-h-full">
                            <div className="p-3 font-semibold text-sm border-b uppercase text-muted-foreground flex justify-between">
                                <span>{col.name}</span>
                                <span>{tasks.filter(t => t.stateId === col.id).length}</span>
                            </div>

                            <Droppable droppableId={col.id}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`flex-1 p-2 min-h-[150px] overflow-y-auto space-y-3 ${snapshot.isDraggingOver ? 'bg-muted' : ''}`}
                                    >
                                        {tasks.filter(t => t.stateId === col.id).map((task, index) => (
                                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`bg-card text-card-foreground p-4 rounded-xl shadow-sm border ${snapshot.isDragging ? 'shadow-xl shadow-primary/10 border-primary scale-[1.02] rotate-1 z-50 ring-1 ring-primary/20 backdrop-blur-md bg-card/90' : 'hover:border-primary/50 hover:shadow-md'} transition-all duration-200 cursor-grab active:cursor-grabbing group`}
                                                    >
                                                        <div className="flex justify-between items-start mb-2">
                                                            <Badge variant="outline" className="text-[10px] font-mono tracking-tighter bg-muted/50 text-muted-foreground border-none">
                                                                {task.issueKey}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm font-semibold leading-tight text-foreground/90 group-hover:text-primary transition-colors">
                                                            {task.title}
                                                        </p>

                                                        {/* Mock task metadata */}
                                                        <div className="mt-4 flex justify-between items-center text-xs text-muted-foreground">
                                                            <div className="flex items-center gap-3">
                                                                <span className="flex items-center gap-1 hover:text-foreground cursor-pointer transition-colors">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                                                    2
                                                                </span>
                                                                <span className="flex items-center gap-1 hover:text-foreground cursor-pointer transition-colors">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                                                                    1
                                                                </span>
                                                            </div>
                                                            {task.assignee ? (
                                                                <Avatar className="h-6 w-6 border border-background shadow-sm ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                                                                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-[10px] font-bold text-white">
                                                                        {task.assignee.name.charAt(0)}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                            ) : (
                                                                <div className="h-6 w-6 rounded-full border border-dashed border-muted-foreground/50 flex items-center justify-center text-muted-foreground hover:bg-muted hover:border-solid transition-colors">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}
