import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import AboutPage from '../pages/public/AboutPage'
import ServicesPage from '../pages/public/ServicesPage'
import ServiceDetailPage from '../pages/public/ServiceDetailPage'
import ProjectsPage from '../pages/public/ProjectsPage'
import ProjectDetailPage from '../pages/public/ProjectDetailPage'
import MethodPage from '../pages/public/MethodPage'
import ContactPage from '../pages/public/ContactPage'
import QuoteCalculator from '../pages/QuoteCalculator'
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
import ScheduleVisit from '../pages/ScheduleVisit'
import AdminLogin from '../pages/AdminLogin'
import AdminPortfolio from '../pages/AdminPortfolio'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import AdminLeadsPage from '../pages/admin/AdminLeadsPage'
import AdminQuotesPage from '../pages/admin/AdminQuotesPage'
import AdminAppointmentsPage from '../pages/admin/AdminAppointmentsPage'
import AdminPricingPage from '../pages/admin/AdminPricingPage'
import AdminServicesPage from '../pages/admin/AdminServicesPage'
import AdminSettingsPage from '../pages/admin/AdminSettingsPage'
import AdminCustomersPage from '../pages/admin/AdminCustomersPage'
import AdminLeadDetailPage from '../pages/admin/AdminLeadDetailPage'
import AdminProposalDetailPage from '../pages/admin/AdminProposalDetailPage'
import AdminBootstrap from '../pages/admin/AdminBootstrap'
import AdminUsersPage from '../pages/admin/AdminUsersPage'
import AdminTasksPage from '../pages/admin/AdminTasksPage'
import AdminTenantsPage from '../pages/admin/AdminTenantsPage'
import AdminSistemaPage from '../pages/admin/AdminSistemaPage'
import ClientDashboard from '../pages/client/ClientDashboard'
import ClientLeadsPage from '../pages/client/ClientLeadsPage'
import ClientLeadDetailPage from '../pages/client/ClientLeadDetailPage'
import ClientProposalsPage from '../pages/client/ClientProposalsPage'
import ClientProposalDetailPage from '../pages/client/ClientProposalDetailPage'
import ClientQuotesPage from '../pages/client/ClientQuotesPage'
import ClientAppointmentsPage from '../pages/client/ClientAppointmentsPage'
import ClientProfilePage from '../pages/client/ClientProfilePage'
import NotFound from '../pages/NotFound'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<AboutPage />} />
        <Route path="/servicos" element={<ServicesPage />} />
        <Route path="/servicos/:slug" element={<ServiceDetailPage />} />
        <Route path="/obras" element={<ProjectsPage />} />
        <Route path="/obras/:slug" element={<ProjectDetailPage />} />
        <Route path="/metodo" element={<MethodPage />} />
        <Route path="/contato" element={<ContactPage />} />
        <Route path="/orcamento" element={<QuoteCalculator />} />
        <Route path="/entrar" element={<SignIn />} />
        <Route path="/criar-conta" element={<SignUp />} />
        <Route path="/agendar" element={<ScheduleVisit />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/bootstrap" element={<AdminBootstrap />} />

        {/* Admin */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/pedidos" element={<AdminLeadsPage />} />
        <Route path="/admin/pedidos/:leadId" element={<AdminLeadDetailPage />} />
        <Route path="/admin/propostas/:proposalId" element={<AdminProposalDetailPage />} />
        <Route path="/admin/orcamentos" element={<AdminQuotesPage />} />
        <Route path="/admin/agendamentos" element={<AdminAppointmentsPage />} />
        <Route path="/admin/clientes" element={<AdminCustomersPage />} />
        <Route path="/admin/parametros" element={<AdminPricingPage />} />
        <Route path="/admin/servicos" element={<AdminServicesPage />} />
        <Route path="/admin/portfolio" element={<AdminPortfolio />} />
        <Route path="/admin/configuracoes" element={<AdminSettingsPage />} />
        <Route path="/admin/usuarios" element={<AdminUsersPage />} />
        <Route path="/admin/tarefas" element={<AdminTasksPage />} />
        <Route path="/admin/tenants" element={<AdminTenantsPage />} />
        <Route path="/admin/sistema" element={<AdminSistemaPage />} />

        {/* Client */}
        <Route path="/cliente" element={<ClientDashboard />} />
        <Route path="/cliente/solicitacoes" element={<ClientLeadsPage />} />
        <Route path="/cliente/solicitacoes/:leadId" element={<ClientLeadDetailPage />} />
        <Route path="/cliente/propostas" element={<ClientProposalsPage />} />
        <Route path="/cliente/propostas/:proposalId" element={<ClientProposalDetailPage />} />
        <Route path="/cliente/orcamentos" element={<ClientQuotesPage />} />
        <Route path="/cliente/agendamentos" element={<ClientAppointmentsPage />} />
        <Route path="/cliente/perfil" element={<ClientProfilePage />} />

        {/* Platform redirects -> /admin */}
        <Route path="/platform" element={<Navigate to="/admin/sistema" replace />} />
        <Route path="/platform/users" element={<Navigate to="/admin/usuarios" replace />} />
        <Route path="/platform/tenants" element={<Navigate to="/admin/tenants" replace />} />
        <Route path="/platform/settings" element={<Navigate to="/admin/sistema" replace />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
