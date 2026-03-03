import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
    return (
        <div className="flex min-h-screen bg-background items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center flex flex-col items-center">
                    {/* Logo placeholder */}
                    <div className="h-12 w-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-xl font-bold mb-4">
                        C
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Chronos</h1>
                    <p className="text-muted-foreground mt-2">Enterprise Workspace Platform</p>
                </div>
                <Outlet />
            </div>
        </div>
    );
}
