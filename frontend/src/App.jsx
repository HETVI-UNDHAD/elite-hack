import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import AdminDashboard from './pages/AdminDashboard';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import ManageEvent from './pages/ManageEvent';
import AcceptInvite from './pages/AcceptInvite';
import AddEventDetails from './pages/AddEventDetails';
import MyRegistrations from './pages/MyRegistrations';
import QRAttendance from './pages/QRAttendance';
import QRScanner from './pages/QRScanner';
import AboutUs from './pages/AboutUs';
import VerifyOTP from './pages/VerifyOTP';
import ForgotPassword from './pages/ForgotPassword';
import UpdateProfile from './pages/UpdateProfile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/accept-invite/:token" element={<AcceptInvite />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/my-registrations" element={<ProtectedRoute><MyRegistrations /></ProtectedRoute>} />
            <Route path="/qr/:eventId" element={<ProtectedRoute><QRAttendance /></ProtectedRoute>} />
            <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
            <Route path="/events/:id" element={<ProtectedRoute><EventDetail /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/profile" element={<ProtectedRoute adminOnly><UpdateProfile /></ProtectedRoute>} />
            <Route path="/admin/qr-scanner" element={<ProtectedRoute adminOnly><QRScanner /></ProtectedRoute>} />
            <Route path="/admin/create-event" element={<ProtectedRoute adminOnly><CreateEvent /></ProtectedRoute>} />
            <Route path="/admin/edit-event/:id" element={<ProtectedRoute adminOnly><EditEvent /></ProtectedRoute>} />
            <Route path="/admin/event/:id" element={<ProtectedRoute adminOnly><ManageEvent /></ProtectedRoute>} />
            <Route path="/admin/event/:id/add-details" element={<ProtectedRoute adminOnly><AddEventDetails /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
