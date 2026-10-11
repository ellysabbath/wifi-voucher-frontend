import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import BulkSMS from './pages/BulkSMS';
import Gallery from './pages/Gallery';
import Books from './pages/Books';
import Chat from './pages/Chat';
import Leadership from './pages/Leadership';
import News from './pages/News';
import Calendar from './pages/Calendar';
import Ministries from './pages/Ministries';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyAccount from './pages/auth/VerifyAccount';
import ForgotPassword from './pages/auth/ForgotPassword';
import ForgotPasswordCode from './pages/auth/ForgotPasswordCode';
import ResetPassword from './pages/auth/ResetPassword';
import PasswordResetSuccess from './pages/auth/PasswordResetSuccess';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page */}
        <Route path="/landing" element={<Landing />} />
        <Route path="/" element={<Landing />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-account" element={<VerifyAccount />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password-code" element={<ForgotPasswordCode />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/password-reset-success" element={<PasswordResetSuccess />} />

        {/* Main app routes */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/members" element={<Members />} />
          <Route path="/sms" element={<BulkSMS />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/books" element={<Books />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/leadership" element={<Leadership />} />
          <Route path="/news" element={<News />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/ministries" element={<Ministries />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;