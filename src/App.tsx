import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout, RequireAuth } from './layouts/AdminLayout'
import { PublicLayout } from './layouts/PublicLayout'
import { AdminBookings } from './pages/Admin/Bookings'
import { AdminCalendar } from './pages/Admin/Calendar'
import { AdminDashboard } from './pages/Admin/Dashboard'
import { AdminEnquiries } from './pages/Admin/Enquiries'
import { AdminLogin } from './pages/Admin/Login'
import { AdminProperties } from './pages/Admin/Properties'
import { PropertyEditor } from './pages/Admin/PropertyEditor'
import { AdminSettings } from './pages/Admin/Settings'
import { EnquirePage } from './pages/Booking/EnquirePage'
import { HomePage } from './pages/Home/HomePage'
import { AboutPage } from './pages/Info/AboutPage'
import { ContactPage } from './pages/Info/ContactPage'
import { NotFoundPage } from './pages/Info/NotFoundPage'
import { PoliciesPage } from './pages/Info/PoliciesPage'
import { PropertiesPage } from './pages/Properties/PropertiesPage'
import { SavedPage } from './pages/Properties/SavedPage'
import { PropertyDetailsPage } from './pages/PropertyDetails/PropertyDetailsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="stays" element={<PropertiesPage />} />
        <Route path="stays/:slug" element={<PropertyDetailsPage />} />
        <Route path="saved" element={<SavedPage />} />
        <Route path="enquire" element={<EnquirePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="policies" element={<PoliciesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="admin/login" element={<AdminLogin />} />
      <Route path="admin" element={<RequireAuth><AdminLayout /></RequireAuth>}>
        <Route index element={<AdminDashboard />} />
        <Route path="properties" element={<AdminProperties />} />
        <Route path="properties/new" element={<PropertyEditor />} />
        <Route path="properties/:id" element={<PropertyEditor />} />
        <Route path="calendar" element={<AdminCalendar />} />
        <Route path="enquiries" element={<AdminEnquiries />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  )
}
