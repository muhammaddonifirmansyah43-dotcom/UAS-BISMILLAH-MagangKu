import { Routes, Route } from "react-router-dom";

// Guest Pages / Before Login
import LandingPage from "./pages/LandingPage";
import AboutGuest from "./pages/AboutGuest";
import SearchJobsGuest from "./pages/SearchJobsGuest";
import JobDetailGuest from "./pages/JobDetailGuest";
import Register from "./pages/Register";
import Login from "./pages/Login";

// Auth Pages / After Login
import Dashboard from "./pages/Dashboard";
import SavedJobs from "./pages/SavedJobs";
import About from "./pages/About";
import Settings from "./pages/Settings";
import SearchJobs from "./pages/SearchJobs";
import JobDetail from "./pages/JobDetail";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  return (
    <Routes>
      {/* ===================== */}
      {/* PUBLIC / BEFORE LOGIN */}
      {/* ===================== */}

      <Route path="/" element={<LandingPage />} />
      <Route path="/tentang-kami" element={<AboutGuest />} />
      <Route path="/cari-lowongan" element={<SearchJobsGuest />} />
      <Route path="/detail-lowongan/:id" element={<JobDetailGuest />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* ===================== */}
      {/* PRIVATE / AFTER LOGIN */}
      {/* ===================== */}

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/search-jobs" element={<SearchJobs />} />
      <Route path="/job-detail/:id" element={<JobDetail />} />
      <Route path="/saved-jobs" element={<SavedJobs />} />
      <Route path="/about" element={<About />} />
      <Route path="/settings" element={<Settings />} />

      {/* Route lama tetap dibuat agar tidak error kalau masih ada link lama */}
      <Route path="/edit-profile" element={<Settings />} />

      {/* ===================== */}
      {/* ADMIN PAGES */}
      {/* ===================== */}

      <Route path="/admin/dashboard" element={<AdminDashboard />} />

      {/* Jika route tidak ditemukan, kembali ke landing page */}
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}

export default App;