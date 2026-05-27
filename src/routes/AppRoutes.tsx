import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import QuoteCalculator from '../pages/QuoteCalculator'
import AdminLogin from '../pages/AdminLogin'
import AdminPortfolio from '../pages/AdminPortfolio'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import AdminLeadsPage from '../pages/admin/AdminLeadsPage'
import AdminQuotesPage from '../pages/admin/AdminQuotesPage'
import AdminAppointmentsPage from '../pages/admin/AdminAppointmentsPage'
import AdminPricingPage from '../pages/admin/AdminPricingPage'
import AdminServicesPage from '../pages/admin/AdminServicesPage'
import AdminSettingsPage from '../pages/admin/AdminSettingsPage'
import NotFound from '../pages/NotFound'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/orcamento" element={<QuoteCalculator />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/pedidos" element={<AdminLeadsPage />} />
        <Route path="/admin/orcamentos" element={<AdminQuotesPage />} />
        <Route path="/admin/agendamentos" element={<AdminAppointmentsPage />} />
        <Route path="/admin/parametros" element={<AdminPricingPage />} />
        <Route path="/admin/servicos" element={<AdminServicesPage />} />
        <Route path="/admin/portfolio" element={<AdminPortfolio />} />
        <Route path="/admin/configuracoes" element={<AdminSettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
