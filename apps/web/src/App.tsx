import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard';
import Projects from './pages/projects';
import KanbanBoard from './pages/projects/board';
import TaskDetails from './pages/tasks/TaskDetails';
import CalendarView from './pages/calendar';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:projectId/board" element={<KanbanBoard />} />
          <Route path="/projects/:projectId/tasks/:taskId" element={<TaskDetails />} />
          <Route path="/calendar" element={<CalendarView />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
