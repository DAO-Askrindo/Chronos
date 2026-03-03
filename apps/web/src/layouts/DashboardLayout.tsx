import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    FolderKanban,
    CalendarDays,
    Settings,
    LogOut,
    Bell,
    Layers,
    Search,
    Building2,
    ChevronDown,
    Sparkles,
    Users,
    HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const navSections = [
    {
        label: 'Overview',
        items: [
            { to: '/', icon: LayoutDashboard, label: 'Dashboard', exact: true },
        ]
    },
    {
        label: 'Portfolio',
        items: [
            { to: '/projects', icon: FolderKanban, label: 'Projects' },
            { to: '/calendar', icon: CalendarDays, label: 'Calendar' },
        ]
    },
    {
        label: 'Team',
        items: [
            { to: '/members', icon: Users, label: 'Members' },
        ]
    },
];

function NavItem({ to, icon: Icon, label, exact = false }: { to: string; icon: any; label: string; exact?: boolean }) {
    const location = useLocation();
    const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);

    return (
        <Link to={to}>
            <motion.div
                whileHover={{ x: 2 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={cn(
                    "relative flex items-center gap-3 px-3 h-9 rounded-lg text-sm font-medium transition-colors cursor-pointer group",
                    isActive
                        ? "text-foreground bg-primary/8 dark:bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
            >
                {/* Active left border indicator - Linear style */}
                {isActive && (
                    <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-full"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                )}
                <Icon size={16} className={cn("flex-shrink-0 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                <span className={cn(isActive ? "font-semibold" : "")}>{label}</span>
            </motion.div>
        </Link>
    );
}

export default function DashboardLayout() {
    const location = useLocation();

    const pageLabel = location.pathname === '/'
        ? 'Dashboard'
        : location.pathname.split('/').filter(Boolean).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' › ');

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-zinc-950 text-foreground">
            {/* Sidebar */}
            <aside className="w-[240px] flex-shrink-0 border-r border-border/50 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl hidden md:flex flex-col relative z-20">
                {/* Workspace Switcher */}
                <div className="h-14 flex items-center px-4 border-b border-border/40">
                    <button className="flex items-center gap-2.5 group w-full rounded-lg px-2 py-1.5 hover:bg-accent/60 transition-colors -mx-2">
                        <div className="h-7 w-7 bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Layers size={14} />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                            <p className="text-sm font-bold truncate">Chronos</p>
                            <p className="text-[10px] text-muted-foreground font-medium truncate">Holding Corp</p>
                        </div>
                        <ChevronDown size={14} className="text-muted-foreground flex-shrink-0" />
                    </button>
                </div>

                {/* Search */}
                <div className="px-3 pt-3 pb-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground w-3.5 h-3.5" />
                        <Input
                            placeholder="Search..."
                            className="w-full bg-accent/40 border-transparent hover:border-border/50 focus:border-border text-sm pl-8 h-8 transition-colors"
                        />
                        <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/60 bg-background px-1.5 py-0.5 rounded border border-border/50">⌘K</kbd>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-2 overflow-y-auto styled-scrollbar space-y-6 pb-4">
                    {navSections.map((section) => (
                        <div key={section.label}>
                            <p className="px-3 text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.12em] mb-1">{section.label}</p>
                            <div className="space-y-0.5">
                                {section.items.map((item) => (
                                    <NavItem key={item.to} {...item} />
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Bottom Area */}
                <div className="border-t border-border/40 p-3 space-y-0.5">
                    <Link to="/settings">
                        <motion.div
                            whileHover={{ x: 2 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            className="flex items-center gap-3 px-3 h-9 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors cursor-pointer"
                        >
                            <Settings size={16} className="flex-shrink-0" />
                            Settings
                        </motion.div>
                    </Link>
                    <motion.div
                        whileHover={{ x: 2 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="flex items-center gap-3 px-3 h-9 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors cursor-pointer"
                    >
                        <HelpCircle size={16} className="flex-shrink-0" />
                        Help & Support
                    </motion.div>

                    {/* User profile */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-3 px-2 py-2 w-full rounded-lg hover:bg-accent/60 transition-colors group mt-2">
                                <Avatar className="h-7 w-7 border border-border flex-shrink-0">
                                    <AvatarFallback className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-black">IF</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 text-left min-w-0">
                                    <p className="text-xs font-bold truncate">Ivan Fan</p>
                                    <p className="text-[10px] text-muted-foreground truncate">ivanfan@holding.com</p>
                                </div>
                                <ChevronDown size={13} className="text-muted-foreground flex-shrink-0" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" side="top" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-0.5">
                                    <p className="text-sm font-bold leading-none">Ivan Fan</p>
                                    <p className="text-xs leading-none text-muted-foreground mt-1">ivanfan@holding.com</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2"><Building2 size={14} />Switch Workspace</DropdownMenuItem>
                            <DropdownMenuItem className="gap-2"><Sparkles size={14} />Upgrade Plan</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-rose-500 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/50 gap-2 cursor-pointer">
                                <LogOut size={14} />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 relative p-3 pl-0 min-h-0">
                <div className="bg-white/90 dark:bg-zinc-900/80 backdrop-blur-2xl rounded-2xl border border-border/40 flex-1 flex flex-col overflow-hidden relative shadow-sm">
                    {/* Header */}
                    <header className="h-14 border-b border-border/40 flex items-center justify-between px-6">
                        <div className="flex items-center gap-3">
                            <h2 className="text-base font-bold capitalize">
                                {pageLabel}
                            </h2>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button variant="outline" size="icon" className="relative rounded-xl h-8 w-8 bg-background/80 border-border/50 hover:bg-accent transition-colors">
                                <Bell size={15} className="text-muted-foreground" />
                                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-1 ring-background"></span>
                            </Button>

                            <div className="h-5 w-px bg-border/60" />

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-9 rounded-xl px-2 bg-background/80 border border-border/50 hover:bg-accent/60 transition-colors flex items-center gap-2.5">
                                        <Avatar className="h-6 w-6 border border-border">
                                            <AvatarFallback className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black">IF</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm font-semibold">Ivan Fan</span>
                                        <ChevronDown size={13} className="text-muted-foreground" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-0.5">
                                            <p className="text-sm font-bold leading-none">Ivan Fan</p>
                                            <p className="text-xs leading-none text-muted-foreground mt-1">ivanfan@holding.com</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                                    <DropdownMenuItem>Switch Workspace</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-rose-500 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/50 gap-2 cursor-pointer">
                                        <LogOut size={14} />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </header>

                    {/* Page Content */}
                    <main className="flex-1 overflow-x-hidden overflow-y-auto styled-scrollbar">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={location.pathname}
                                initial={{ opacity: 0, y: 12, scale: 0.995 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -12, scale: 0.995 }}
                                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <Outlet />
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </div>
    );
}
