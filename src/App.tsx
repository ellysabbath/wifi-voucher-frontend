import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import RequireRole from "./components/RequireRole";

// ===== Public landing =====
import Landing from "./pages/Landing";

// ===== Admin / staff pages =====
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import BulkSMS from "./pages/BulkSMS";
import Gallery from "./pages/Gallery";
import Books from "./pages/Books";

import Leadership from "./pages/Leadership";
import News from "./pages/News";
import Calendar from "./pages/Calendar";
import Ministries from "./pages/Ministries";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

// ===== User (member) pages =====
import UserDashboard from "./pages/user/UserDashboard";
import MyProfile from "./pages/user/MyProfile";
import MySettings from "./pages/user/MySettings";
import MyNews from "./pages/user/MyNews";
import ChurchImages from "./pages/user/ChurchImages";
import Writings from "./pages/user/Writings";
import MyCalendar from "./pages/user/MyCalendar";
import MyMinistries from "./pages/user/MyMinistries";

// ===== Auth pages =====
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyAccount from "./pages/auth/VerifyAccount";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ForgotPasswordCode from "./pages/auth/ForgotPasswordCode";
import ResetPassword from "./pages/auth/ResetPassword";
import PasswordResetSuccess from "./pages/auth/PasswordResetSuccess";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ============================================================
              PUBLIC PAGES — no layout, no auth required
              ============================================================ */}
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />

          {/* ============================================================
              AUTH PAGES
              ============================================================ */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-account" element={<VerifyAccount />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/forgot-password-code"
            element={<ForgotPasswordCode />}
          />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/password-reset-success"
            element={<PasswordResetSuccess />}
          />

          {/* ============================================================
              AUTHENTICATED AREA — everything below shares the Layout
              ============================================================ */}
          <Route element={<Layout />}>
            {/* ---------- ADMIN / STAFF (role: elder+) ---------- */}

            <Route
              path="/admin"
              element={<Navigate to="/admin/dashboard" replace />}
            />

            <Route
              path="/admin/dashboard"
              element={
                <RequireRole minRole="elder">
                  <Dashboard />
                </RequireRole>
              }
            />

            <Route
              path="/admin/members"
              element={
                <RequireRole minRole="elder">
                  <Members />
                </RequireRole>
              }
            />

            <Route
              path="/admin/sms"
              element={
                <RequireRole minRole="elder">
                  <BulkSMS />
                </RequireRole>
              }
            />

            <Route
              path="/admin/gallery"
              element={
                <RequireRole minRole="elder">
                  <Gallery />
                </RequireRole>
              }
            />

            <Route
              path="/admin/books"
              element={
                <RequireRole minRole="elder">
                  <Books />
                </RequireRole>
              }
            />

            <Route
              path="/admin/leadership"
              element={
                <RequireRole minRole="elder">
                  <Leadership />
                </RequireRole>
              }
            />

            <Route
              path="/admin/news"
              element={
                <RequireRole minRole="elder">
                  <News />
                </RequireRole>
              }
            />

            <Route
              path="/admin/calendar"
              element={
                <RequireRole minRole="elder">
                  <Calendar />
                </RequireRole>
              }
            />

            <Route
              path="/admin/ministries"
              element={
                <RequireRole minRole="elder">
                  <Ministries />
                </RequireRole>
              }
            />

            {/* ---------- SHARED (any logged-in user) ---------- */}



            <Route
              path="/admin/profile"
              element={
                <RequireRole minRole="member">
                  <Profile />
                </RequireRole>
              }
            />

            <Route
              path="/admin/settings"
              element={
                <RequireRole minRole="member">
                  <Settings />
                </RequireRole>
              }
            />

            {/* ---------- USER / MEMBER area ---------- */}

            <Route
              path="/user"
              element={<Navigate to="/user/dashboard" replace />}
            />

            <Route
              path="/user/dashboard"
              element={
                <RequireRole minRole="member">
                  <UserDashboard />
                </RequireRole>
              }
            />

            <Route
              path="/user/profile"
              element={
                <RequireRole minRole="member">
                  <MyProfile />
                </RequireRole>
              }
            />

            <Route
              path="/user/settings"
              element={
                <RequireRole minRole="member">
                  <MySettings />
                </RequireRole>
              }
            />

            <Route
              path="/user/news"
              element={
                <RequireRole minRole="member">
                  <MyNews />
                </RequireRole>
              }
            />

            <Route
              path="/user/gallery"
              element={
                <RequireRole minRole="member">
                  <ChurchImages />
                </RequireRole>
              }
            />

            <Route
              path="/user/writings"
              element={
                <RequireRole minRole="member">
                  <Writings />
                </RequireRole>
              }
            />

            <Route
              path="/user/calendar"
              element={
                <RequireRole minRole="member">
                  <MyCalendar />
                </RequireRole>
              }
            />

            <Route
              path="/user/ministries"
              element={
                <RequireRole minRole="member">
                  <MyMinistries />
                </RequireRole>
              }
            />

            {/* ---------- LEGACY REDIRECTS (old bookmarks still work) ---------- */}

            <Route
              path="/dashboard"
              element={<Navigate to="/admin/dashboard" replace />}
            />
            <Route
              path="/members"
              element={<Navigate to="/admin/members" replace />}
            />
            <Route
              path="/sms"
              element={<Navigate to="/admin/sms" replace />}
            />
            <Route
              path="/gallery"
              element={<Navigate to="/admin/gallery" replace />}
            />
            <Route
              path="/books"
              element={<Navigate to="/admin/books" replace />}
            />
            <Route
              path="/chat"
              element={<Navigate to="/admin/chat" replace />}
            />
            <Route
              path="/leadership"
              element={<Navigate to="/admin/leadership" replace />}
            />
            <Route
              path="/news"
              element={<Navigate to="/admin/news" replace />}
            />
            <Route
              path="/calendar"
              element={<Navigate to="/admin/calendar" replace />}
            />
            <Route
              path="/ministries"
              element={<Navigate to="/admin/ministries" replace />}
            />
            <Route
              path="/profile"
              element={<Navigate to="/admin/profile" replace />}
            />
            <Route
              path="/settings"
              element={<Navigate to="/admin/settings" replace />}
            />
          </Route>

          {/* ============================================================
              FALLBACK — unknown URL → landing
              ============================================================ */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;