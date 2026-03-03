import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Calendar, Clock, BarChart2, FolderKanban } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import apiClient from '@/lib/axios';

interface Project {
    id: string;
    name: string;
    key: string;
    status: string;
    _count: {
        tasks: number;
        members: number;
    };
    // Mocking progress and timeline dates for the Timeline View
    progress?: number;
    startDate?: string;
    endDate?: string;
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { type: "spring", stiffness: 100 }
    }
};

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await apiClient.get('/projects');
                // Hydrate with mock timeline data for the Gantt/Timeline aesthetic
                const hydrated = response.data.data.map((p: any) => ({
                    ...p,
                    progress: Math.floor(Math.random() * 60) + 20, // 20% to 80%
                    startDate: new Date(Date.now() - (Math.random() * 30 * 86400000)).toISOString(),
                    endDate: new Date(Date.now() + (Math.random() * 60 * 86400000)).toISOString()
                }));
                setProjects(hydrated);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Helper to render timeline bar
    const renderTimelineBar = (progress: number = 0) => (
        <div className="w-full flex items-center gap-4">
            <div className="flex-1 h-2.5 relative bg-secondary/50 rounded-full overflow-hidden shadow-inner backdrop-blur-sm border border-black/5 dark:border-white/5">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                />
            </div>
            <span className="text-xs font-bold w-10 text-right tabular-nums text-muted-foreground">{progress}%</span>
        </div>
    );

    return (
        <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">Portfolio Timeline</h1>
                    <p className="text-muted-foreground text-lg">Track execution and dependencies across all active projects.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2 bg-background/50 backdrop-blur-md">
                        <Calendar size={16} /> Month View
                    </Button>
                    <Button className="gap-2 shadow-lg shadow-primary/20">
                        <Plus size={16} /> New Project
                    </Button>
                </div>
            </div>

            <Card className="border-border/50 bg-white/40 dark:bg-black/40 backdrop-blur-xl shadow-sm">
                <CardHeader className="pb-4 border-b border-border/50">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Active Initiatives</CardTitle>
                            <CardDescription>Real-time progress tracking.</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Badge variant="outline" className="bg-primary/5 text-primary">On Track</Badge>
                            <Badge variant="outline" className="bg-destructive/5 text-destructive">At Risk</Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-border/50">
                        {/* Table Header equivalent */}
                        <div className="grid grid-cols-12 gap-4 p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/20">
                            <div className="col-span-4">Project Overview</div>
                            <div className="col-span-2">Health / Status</div>
                            <div className="col-span-2">Team</div>
                            <div className="col-span-4">Execution Timeline</div>
                        </div>

                        {/* List rendering */}
                        {isLoading ? (
                            <div className="p-8 text-center text-muted-foreground animate-pulse">
                                Loading portfolio data...
                            </div>
                        ) : projects.length === 0 ? (
                            <div className="p-16 flex flex-col items-center justify-center text-center">
                                <div className="h-16 w-16 mb-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/30 shadow-inner">
                                    <FolderKanban size={32} className="text-indigo-500/50" />
                                </div>
                                <h3 className="text-lg font-bold text-foreground/90 mb-1">No active projects</h3>
                                <p className="text-sm text-muted-foreground/80 max-w-sm mx-auto mb-6 leading-relaxed">
                                    Your portfolio is currently empty. Start by creating your first project initiative to track progress and team execution.
                                </p>
                                <Button className="gap-2 shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 transition-all font-bold group">
                                    <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" /> Create First Project
                                </Button>
                            </div>
                        ) : (
                            projects.map((project) => (
                                <motion.div
                                    variants={itemVariants}
                                    key={project.id}
                                    className="grid grid-cols-12 gap-4 p-5 hover:bg-white/60 dark:hover:bg-zinc-900/60 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-300 items-center group cursor-pointer border-b border-transparent hover:border-border/50 rounded-xl mx-2 my-1"
                                >
                                    <div className="col-span-4 flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold shadow-sm group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-purple-500 group-hover:text-white transition-all duration-300">
                                            {project.key}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-base">{project.name}</p>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                                <span className="flex items-center gap-1"><BarChart2 size={12} /> {project._count.tasks} Tasks</span>
                                                <span className="flex items-center gap-1"><Clock size={12} /> Q3 Target</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-2">
                                        <Badge variant={project.status === 'Planning' ? 'secondary' : 'default'} className="shadow-sm">
                                            {project.status}
                                        </Badge>
                                    </div>

                                    <div className="col-span-2 flex -space-x-2">
                                        {Array.from({ length: Math.min(project._count.members || 2, 3) }).map((_, i) => (
                                            <Avatar key={i} className="w-8 h-8 border-2 border-background shadow-sm">
                                                <AvatarFallback className="text-[10px] bg-secondary">U{i + 1}</AvatarFallback>
                                            </Avatar>
                                        ))}
                                        {(project._count.members || 0) > 3 && (
                                            <div className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-medium z-10">
                                                +{(project._count.members || 0) - 3}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-span-4 flex flex-col justify-center">
                                        {renderTimelineBar(project.progress)}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
