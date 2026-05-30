import { Routes, Route } from "react-router-dom";

// Guest Pages
import LandingPage from "./pages/LandingPage";
import AboutGuest from "./pages/AboutGuest";
import SearchJobsGuest from "./pages/SearchJobsGuest";
import JobDetailGuest from "./pages/JobDetailGuest";
import Register from "./pages/Register";

// Auth Pages (sementara nanti)
import Dashboard from "./pages/Dashboard";
import SavedJobs from "./pages/SavedJobs";
import About from "./pages/About";
import EditProfile from "./pages/EditProfile";
import SearchJobs from "./pages/SearchJobs";
import JobDetail from "./pages/JobDetail";

function App() {
  return (
    <Routes>
      {/* ===================== */}
      {/* PUBLIC / BEFORE LOGIN */}
      {/* ===================== */}

      <Route path="/" element={<LandingPage />} />

      <Route
        path="/tentang-kami"
        element={<AboutGuest />}
      />

      <Route
        path="/cari-lowongan"
        element={<SearchJobsGuest />}
      />

      <Route
        path="/detail-lowongan/:id"
        element={<JobDetailGuest />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* ===================== */}
      {/* PRIVATE / AFTER LOGIN */}
      {/* ===================== */}

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/search-jobs"
        element={<SearchJobs />}
      />

      <Route
        path="/job-detail/:id"
        element={<JobDetail />}
      />

      <Route
        path="/saved-jobs"
        element={<SavedJobs />}
      />

      <Route
        path="/about"
        element={<About />}
      />

      <Route
        path="/edit-profile"
        element={<EditProfile />}
      />
    </Routes>
  );
}

export default App;