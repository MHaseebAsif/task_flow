import { Routes, Route } from 'react-router-dom';
import WebsiteLayout from '../website/layouts/WebsiteLayout';
import LandingPage from '../website/pages/LandingPage';
import Login from '../auth/pages/Login';
import Signup from '../auth/pages/Signup';
import AdminRoute from './AdminRoute';
import AdminLayout from '../admin/layouts/AdminLayout';
import AdminDashboard from '../admin/pages/Dashboard';
import Companies from '../admin/pages/Companies';
import CompanyDetails from '../admin/pages/CompanyDetails';
import CompanyRoute from './CompanyRoute';
import CompanyLayout from '../company/layouts/CompanyLayout';
import CompanyDashboard from '../company/pages/Dashboard';
import Projects from '../company/pages/Projects';
import ProjectDetails from '../company/pages/ProjectDetails';
import Tasks from '../company/pages/Tasks';
import Team from '../company/pages/Team';
import AuditLogs from '../company/pages/AuditLogs';
import Settings from '../company/pages/Settings';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<WebsiteLayout />}>
        <Route index element={<LandingPage />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin/*" element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="companies" element={<Companies />} />
          <Route path="companies/:id" element={<CompanyDetails />} />
        </Route>
      </Route>
      <Route path="/company/*" element={<CompanyRoute />}>
        <Route element={<CompanyLayout />}>
          <Route path="dashboard" element={<CompanyDashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetails />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="team" element={<Team />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
