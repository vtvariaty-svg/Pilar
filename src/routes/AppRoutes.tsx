import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import QuoteCalculator from '../pages/QuoteCalculator'
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
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
import AdminBootstrap from '../pages/admin/AdminBootstrap'
import AdminUsersPage from '../pages/admin/AdminUsersPage'
import ClientDashboard from '../pages/client/ClientDashboard'
import ClientLeadsPage from '../pages/client/ClientLeadsPage'
import ClientQuotesPage from '../pages/client/ClientQuotesPage'
import ClientAppointmentsPage from '../pages/client/ClientAppointmentsPage'
import ClientProfilePage from '../pages/client/ClientProfilePage'
import PlatformDashboard from '../pages/platform/PlatformDashboard'
import PlatformTenantsPage from '../pages/platform/PlatformTenantsPage'
import PlatformUsersPage from '../pages/platform/PlatformUsersPage'
import PlatformSettingsPage from '../pages/platform/PlatformSettingsPage'
import NotFound from '../pages/NotFound'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/orcamento" element={<QuoteCalculator />} />
        <Route path="/entrar" element={<SignIn />} />
        <Route path="/criar-conta" element={<SignUp />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/bootstrap" element={<AdminBootstrap />} />

        {/* Admin */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/pedidos" element={<AdminLeadsPage />} />
        <Route path="/admin/orcamentos" element={<AdminQuotesPage />} />
        <Route path="/admin/agendamentos" element={<AdminAppointmentsPage />} />
        <Route path="/admin/clientes" element={<AdminCustomersPage />} />
        <Route path="/admin/parametros" element={<AdminPricingPage />} />
        <Route path="/admin/servicos" element={<AdminServicesPage />} />
        <Route path="/admin/portfolio" element={<AdminPortfolio />} />
        <Route path="/admin/configuracoes" element={<AdminSettingsPage />} />
        <Route path="/admin/usuarios" element={<AdminUsersPage />} />

        {/* Client */}
        <Route path="/cliente" element={<ClientDashboard />} />
        <Route path="/cliente/solicitacoes" element={<ClientLeadsPage />} />
        <Route path="/cliente/orcamentos" element={<ClientQuotesPage />} />
        <Route path="/cliente/agendamentos" element={<ClientAppointmentsPage />} />
        <Route path="/cliente/perfil" element={<ClientProfilePage />} />

        {/* Platform */}
        <Route path="/platform" element={<PlatformDashboard />} />
        <Route path="/platform/tenants" element={<PlatformTenantsPage />} />
        <Route path="/platform/users" element={<PlatformUsersPage />} />
        <Route path="/platform/settings" element={<PlatformSettingsPage />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
