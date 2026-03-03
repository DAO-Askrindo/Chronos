import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MeetingRSVPWidget } from "@/components/MeetingRSVPWidget";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    Area,
    AreaChart,
} from "recharts";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Briefcase, CheckCircle2, AlertCircle, Clock, TrendingUp, Activity, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

// Dashboard Data
const projectHealthData = [
    { name: 'Q1', completed: 12, delayed: 2, ongoing: 15 },
    { name: 'Q2', completed: 19, delayed: 3, ongoing: 18 },
    { name: 'Q3', completed: 15, delayed: 5, ongoing: 20 },
    { name: 'Q4', completed: 25, delayed: 1, ongoing: 10 },
];

const budgetData = [
    { month: 'Jan', planned: 4000, actual: 2400 },
    { month: 'Feb', planned: 3000, actual: 1398 },
    { month: 'Mar', planned: 2000, actual: 9800 },
    { month: 'Apr', planned: 2780, actual: 3908 },
    { month: 'May', planned: 1890, actual: 4800 },
    { month: 'Jun', planned: 2390, actual: 3800 },
];

// Sparkline data for KPI cards
const sparkPortfolios = [{ v: 8 }, { v: 9 }, { v: 9 }, { v: 10 }, { v: 11 }, { v: 10 }, { v: 12 }];
const sparkOnTrack = [{ v: 38 }, { v: 40 }, { v: 39 }, { v: 42 }, { v: 43 }, { v: 44 }, { v: 45 }];
const sparkRisk = [{ v: 2 }, { v: 3 }, { v: 5 }, { v: 4 }, { v: 5 }, { v: 3 }, { v: 4 }];
const sparkPending = [{ v: 12 }, { v: 10 }, { v: 11 }, { v: 9 }, { v: 8 }, { v: 9 }, { v: 8 }];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 120, damping: 18 }
    }
};

// Premium Sparkline Tooltip
const SparkTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
        return (
            <div className="rounded-lg px-2 py-1 text-[10px] font-bold bg-white/20 text-white backdrop-blur-sm border border-white/10">
                {payload[0].value}
            </div>
        );
    }
    return null;
};

// KPI Card Configuration
const kpiCards = [
    {
        label: 'Active Portfolios',
        value: '12',
        delta: '+2',
        deltaType: 'up' as const,
        deltaSub: 'from last month',
        icon: Briefcase,
        bg: 'from-indigo-950 via-indigo-900 to-indigo-800',
        accent: '#a5b4fc',
        sparkData: sparkPortfolios,
        svgBlobs: (
            <svg className="absolute right-0 top-0 h-full w-2/3 pointer-events-none opacity-70" viewBox="0 0 300 180" fill="none">
                <circle cx="240" cy="90" r="90" fill="white" fillOpacity="0.06" />
                <circle cx="280" cy="40" r="55" fill="white" fillOpacity="0.08" />
                <circle cx="200" cy="160" r="40" fill="white" fillOpacity="0.05" />
            </svg>
        ),
    },
    {
        label: 'Projects on Track',
        value: '45',
        delta: '+7',
        deltaType: 'up' as const,
        deltaSub: '85% completion rate',
        icon: CheckCircle2,
        bg: 'from-emerald-950 via-emerald-900 to-emerald-800',
        accent: '#6ee7b7',
        sparkData: sparkOnTrack,
        svgBlobs: (
            <svg className="absolute right-0 top-0 w-48 h-48 pointer-events-none" viewBox="0 0 200 200" fill="none">
                <ellipse cx="170" cy="60" rx="45" ry="20" fill="white" fillOpacity="0.08" />
                <rect x="120" y="20" width="70" height="22" rx="8" fill="white" fillOpacity="0.07" />
                <polygon points="150,0 200,0 200,55" fill="white" fillOpacity="0.06" />
                <circle cx="185" cy="110" r="15" fill="white" fillOpacity="0.10" />
            </svg>
        ),
    },
    {
        label: 'At Risk Projects',
        value: '4',
        delta: '+1',
        deltaType: 'down' as const,
        deltaSub: 'Needs attention',
        icon: AlertCircle,
        bg: 'from-rose-950 via-rose-900 to-rose-800',
        accent: '#fca5a5',
        sparkData: sparkRisk,
        svgBlobs: (
            <svg className="absolute right-0 top-0 w-48 h-48 pointer-events-none" viewBox="0 0 200 200" fill="none">
                <polygon points="200,0 200,100 100,0" fill="white" fillOpacity="0.07" />
                <circle cx="160" cy="80" r="30" fill="white" fillOpacity="0.06" />
                <line x1="120" y1="0" x2="200" y2="90" stroke="white" strokeOpacity="0.05" strokeWidth="8" />
                <circle cx="185" cy="30" r="12" fill="white" fillOpacity="0.12" />
            </svg>
        ),
    },
    {
        label: 'Pending Decisions',
        value: '8',
        delta: '-2',
        deltaType: 'neutral' as const,
        deltaSub: 'Across 3 portfolios',
        icon: Clock,
        bg: 'from-amber-950 via-amber-900 to-amber-800',
        accent: '#fcd34d',
        sparkData: sparkPending,
        svgBlobs: (
            <svg className="absolute right-0 top-0 w-48 h-48 pointer-events-none" viewBox="0 0 200 200" fill="none">
                <rect x="120" y="0" width="70" height="70" rx="35" fill="white" fillOpacity="0.07" />
                <ellipse cx="175" cy="85" rx="25" ry="12" fill="white" fillOpacity="0.10" />
                <polygon points="200,0 200,60 140,0" fill="white" fillOpacity="0.06" />
                <circle cx="155" cy="30" r="10" fill="white" fillOpacity="0.14" />
            </svg>
        ),
    },
];

export default function Dashboard() {
    return (
        <motion.div
            className="space-y-8 pb-12 max-w-[1400px] mx-auto px-6 pt-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 relative flex-shrink-0">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-primary/70 uppercase tracking-widest mb-1">
                        <Activity size={12} />
                        Executive Command Center
                    </div>
                    <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground/90 to-foreground/60">
                        Portfolio Overview
                    </h1>
                    <p className="text-muted-foreground font-medium">Your strategic metrics and team performance at a glance.</p>
                </div>
                <div className="self-start sm:self-auto">
                    <motion.button
                        whileHover={{ scale: 1.03, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow whitespace-nowrap"
                    >
                        <TrendingUp size={15} />
                        Generate Report
                    </motion.button>
                </div>
            </motion.div>

            {/* Hero Bento Row: Health Score + KPI Grid */}
            <motion.div variants={itemVariants} className="grid gap-5 lg:grid-cols-5">
                {/* Hero Portfolio Health Score */}
                <div className="lg:col-span-2 relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between min-h-[220px] bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 border border-white/10 shadow-2xl">
                    {/* Glassmorphic background blobs */}
                    <div className="absolute -top-10 -right-10 w-48 h-48 bg-indigo-500/20 rounded-full blur-[60px] pointer-events-none" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-violet-500/20 rounded-full blur-[60px] pointer-events-none" />
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 400 250" fill="none" preserveAspectRatio="xMidYMid slice">
                        <circle cx="350" cy="50" r="100" fill="url(#heroGrad1)" />
                        <circle cx="80" cy="200" r="80" fill="url(#heroGrad2)" />
                        <defs>
                            <radialGradient id="heroGrad1" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                            </radialGradient>
                            <radialGradient id="heroGrad2" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                            </radialGradient>
                        </defs>
                    </svg>

                    <div className="relative z-10 space-y-1">
                        <p className="text-xs font-bold text-white/50 uppercase tracking-widest">Portfolio Health Score</p>
                        <div className="flex items-end gap-3">
                            <span className="text-7xl font-black text-white tabular-nums tracking-tighter leading-none">87</span>
                            <div className="pb-2 space-y-1">
                                <span className="text-2xl font-black text-white/40">/100</span>
                                <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                                    <ArrowUpRight size={10} />
                                    +3 pts
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 space-y-2">
                        <div className="flex justify-between text-xs font-semibold text-white/50">
                            <span>Overall Health</span>
                            <span>87%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "87%" }}
                                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                                className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.6)]"
                            />
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-white/30">
                            <span>Critical</span>
                            <span>Excellent</span>
                        </div>
                    </div>
                </div>

                {/* KPI 2×2 Grid */}
                <div className="lg:col-span-3 grid grid-cols-2 gap-4">
                    {kpiCards.map((card, idx) => {
                        const Icon = card.icon;
                        const DeltaIcon = card.deltaType === 'up' ? ArrowUpRight : card.deltaType === 'down' ? ArrowDownRight : Minus;
                        const deltaColor = card.deltaType === 'up'
                            ? 'text-emerald-300 bg-emerald-400/15 border-emerald-400/20'
                            : card.deltaType === 'down'
                                ? 'text-rose-300 bg-rose-400/15 border-rose-400/20'
                                : 'text-amber-300 bg-amber-400/15 border-amber-400/20';

                        return (
                            <motion.div
                                key={card.label}
                                whileHover={{ y: -4, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0, transition: { delay: idx * 0.07, type: "spring", stiffness: 120 } }}
                                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.bg} p-4 cursor-pointer shadow-xl border border-white/5`}
                            >
                                {card.svgBlobs}
                                <div className="relative z-10 flex flex-col h-full gap-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-white/70 uppercase tracking-widest leading-tight drop-shadow-sm">{card.label}</span>
                                        <div className="h-7 w-7 rounded-lg bg-white/10 flex items-center justify-center border border-white/10 shadow-inner">
                                            <Icon size={14} className="text-white/90 drop-shadow-sm" />
                                        </div>
                                    </div>
                                    <div className="flex items-end justify-between gap-2">
                                        <div className="space-y-1">
                                            <div className="text-4xl font-black text-white tabular-nums tracking-tighter leading-none drop-shadow-md">{card.value}</div>
                                            <div className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${deltaColor}`}>
                                                <DeltaIcon size={9} />
                                                {card.delta} · {card.deltaSub}
                                            </div>
                                        </div>
                                        <div className="h-12 w-24 flex-shrink-0">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={card.sparkData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                                                    <Line
                                                        type="monotone"
                                                        dataKey="v"
                                                        stroke={card.accent}
                                                        strokeWidth={2.5}
                                                        dot={false}
                                                        activeDot={{ r: 3, strokeWidth: 0, fill: card.accent }}
                                                    />
                                                    <Tooltip content={<SparkTooltip />} cursor={false} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Charts Row */}
            <div className="grid gap-5 lg:grid-cols-7 lg:mt-6 mt-4">
                {/* Main Chart Area */}
                <motion.div
                    variants={itemVariants}
                    className="lg:col-span-4 flex flex-col gap-5"
                >
                    <motion.div
                        whileInView={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 20 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="border-border/40 bg-card/80 backdrop-blur-xl shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg font-bold">Portfolio Delivery Health</CardTitle>
                                        <CardDescription className="text-xs mt-0.5">Completion status across all active projects by quarter.</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground">
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />Completed</span>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />Ongoing</span>
                                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />Delayed</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="h-[260px] pt-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={projectHealthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={4}>
                                        <defs>
                                            <linearGradient id="gCompleted" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                                                <stop offset="100%" stopColor="#10b981" stopOpacity={0.4} />
                                            </linearGradient>
                                            <linearGradient id="gOngoing" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                                                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.4} />
                                            </linearGradient>
                                            <linearGradient id="gDelayed" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#f43f5e" stopOpacity={1} />
                                                <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.4} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} dy={8} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                                        <Tooltip
                                            cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3, radius: 6 }}
                                            contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.15)', backgroundColor: 'hsl(var(--card))' }}
                                        />
                                        <Bar dataKey="completed" fill="url(#gCompleted)" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="ongoing" fill="url(#gOngoing)" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="delayed" fill="url(#gDelayed)" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        whileInView={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 20 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Card className="border-border/40 bg-card/80 backdrop-blur-xl shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-bold">Budget vs Actual (YTD)</CardTitle>
                                <CardDescription className="text-xs mt-0.5">Financial burn rate aggregated across tracked portfolios (in Millions).</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[240px] pt-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={budgetData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="fillPlanned" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.15} />
                                                <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="fillActual" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                            </linearGradient>
                                            <filter id="lineShadow" height="200%">
                                                <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#0ea5e9" floodOpacity="0.35" />
                                            </filter>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} dy={8} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.15)', backgroundColor: 'hsl(var(--card))' }}
                                        />
                                        <Area type="monotone" dataKey="planned" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} strokeDasharray="5 5" fill="url(#fillPlanned)" dot={false} />
                                        <Area type="monotone" dataKey="actual" stroke="#0ea5e9" strokeWidth={3} fill="url(#fillActual)" dot={{ r: 4, strokeWidth: 2, fill: 'hsl(var(--card))' }} activeDot={{ r: 6, strokeWidth: 0, fill: '#0ea5e9' }} filter="url(#lineShadow)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>

                {/* Side Area: Meetings & Milestones */}
                <motion.div variants={itemVariants} className="lg:col-span-3 flex flex-col gap-5">
                    <Card className="border-none shadow-none bg-transparent">
                        <CardHeader className="px-0 pt-0 pb-4">
                            <CardTitle className="text-lg font-bold">Smart Meetings</CardTitle>
                            <CardDescription className="text-xs">Pending invites requiring your action.</CardDescription>
                        </CardHeader>
                        <CardContent className="px-0 space-y-3">
                            <MeetingRSVPWidget
                                meeting={{
                                    id: 'test-1',
                                    title: 'Sprint Planning: Q3',
                                    startTime: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
                                    endTime: new Date(new Date().setHours(15, 30, 0, 0)).toISOString(),
                                    linkedProject: { name: 'Core Platform', key: 'PLAT' }
                                }}
                                initialStatus="pending"
                            />
                            <MeetingRSVPWidget
                                meeting={{
                                    id: 'test-2',
                                    title: 'Steering Committee Sync',
                                    startTime: new Date(Date.now() + 86400000).toISOString(),
                                    endTime: new Date(Date.now() + 90000000).toISOString(),
                                    location: 'Zoom Room A'
                                }}
                                initialStatus="accepted"
                            />
                        </CardContent>
                    </Card>

                    <Card className="border-border/40 bg-card/80 backdrop-blur-xl shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-bold">Recent Milestones</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-0">
                            {[
                                { title: 'Database Migration Complete', project: 'Data Lake · DLK', time: '2h ago', color: 'bg-emerald-500', type: 'success' },
                                { title: 'Design System v2 Shipped', project: 'Core Platform · PLAT', time: '5h ago', color: 'bg-blue-500', type: 'info' },
                                { title: 'API Gateway Delayed', project: 'Infra · INFRA', time: '1d ago', color: 'bg-rose-500', type: 'danger' },
                                { title: 'Q3 Review Approved', project: 'Portfolio · CORP', time: '2d ago', color: 'bg-violet-500', type: 'info' },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ x: 4 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    className="flex items-center gap-4 py-3 border-b border-border/40 last:border-0 cursor-default"
                                >
                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.color} shadow-[0_0_6px_currentColor]`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold leading-tight truncate">{item.title}</p>
                                        <p className="text-[11px] text-muted-foreground mt-0.5">{item.project}</p>
                                    </div>
                                    <span className="text-[10px] font-bold text-muted-foreground/60 flex-shrink-0">{item.time}</span>
                                </motion.div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}
