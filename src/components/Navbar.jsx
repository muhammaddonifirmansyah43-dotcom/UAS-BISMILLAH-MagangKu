import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Bookmark,
  Settings,
  Info,
  LogOut,
  ChevronDown,
} from "lucide-react";

import userPhoto from "../assets/Karim-Benzema-Profil.jpeg";
import logo from "../assets/Logo_MagangKu.png";
import ProfileModal from "./ProfileModal";

const defaultProfile = {
  name: "Karim Benzema",
  email: "karimbenzema@gmail.com",
  school: "Universitas of Santiago de Bernabeu",
  photo: userPhoto,
};

function Navbar() {
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const [profile, setProfile] = useState(() => {
    const userProfile = JSON.parse(localStorage.getItem("userProfile"));
    const user = JSON.parse(localStorage.getItem("user"));

    return userProfile || {
      ...defaultProfile,
      name: user?.name || defaultProfile.name,
      email: user?.email || defaultProfile.email,
    };
  });

  useEffect(() => {
    const loadProfile = () => {
      const storedProfile = JSON.parse(localStorage.getItem("userProfile"));
      const user = JSON.parse(localStorage.getItem("user"));

      setProfile(
        storedProfile || {
          ...defaultProfile,
          name: user?.name || defaultProfile.name,
          email: user?.email || defaultProfile.email,
        }
      );
    };

    loadProfile();

    window.addEventListener("focus", loadProfile);
    window.addEventListener("profileUpdated", loadProfile);

    return () => {
      window.removeEventListener("focus", loadProfile);
      window.removeEventListener("profileUpdated", loadProfile);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("savedJobs");

    setLogoutModalOpen(false);
    setDropdownOpen(false);

    navigate("/");
  };

  const openProfileOnly = () => {
    setDropdownOpen(false);
    setProfileModalOpen(true);
  };

  return (
    <>
      <header className="navbar">
        <div className="brand">
          <img src={logo} alt="MagangKu" />
        </div>

        <nav className="nav-links">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            Beranda
          </NavLink>

          <NavLink
            to="/search-jobs"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            Cari Lowongan
          </NavLink>
        </nav>

        <div className="user-menu">
          <img
            src={profile.photo || userPhoto}
            alt={profile.name}
            onClick={openProfileOnly}
            className="profile-photo"
          />

          <span onClick={openProfileOnly}>{profile.name}</span>

          <button
            type="button"
            className="dropdown-toggle"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <ChevronDown size={16} />
          </button>

          {dropdownOpen && (
            <div className="dropdown">
              <NavLink to="/saved-jobs" onClick={() => setDropdownOpen(false)}>
                <Bookmark size={16} />
                Simpan Lowongan
              </NavLink>

              <NavLink to="/settings" onClick={() => setDropdownOpen(false)}>
                <Settings size={16} />
                Pengaturan
              </NavLink>

              <NavLink to="/about" onClick={() => setDropdownOpen(false)}>
                <Info size={16} />
                Tentang Kami
              </NavLink>

              <button
                type="button"
                className="danger"
                onClick={() => {
                  setDropdownOpen(false);
                  setLogoutModalOpen(true);
                }}
              >
                <LogOut size={16} />
                Keluar
              </button>
            </div>
          )}
        </div>
      </header>

      {logoutModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <LogOut size={44} className="modal-icon" />

            <p>Anda yakin ingin logout?</p>

            <div className="modal-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setLogoutModalOpen(false)}
              >
                Batal
              </button>

              <button
                type="button"
                className="danger-btn"
                onClick={handleLogout}
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {profileModalOpen && (
        <ProfileModal
          showEditButton={false}
          onClose={() => setProfileModalOpen(false)}
        />
      )}
    </>
  );
}

export default Navbar;