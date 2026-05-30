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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const [profile, setProfile] = useState(() => {
    return JSON.parse(localStorage.getItem("userProfile")) || defaultProfile;
  });

  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = () => {
      const storedProfile = JSON.parse(localStorage.getItem("userProfile"));
      setProfile(storedProfile || defaultProfile);
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
    setLogoutModalOpen(false);
    navigate("/");
  };

  const openProfileOnly = () => {
    setDropdownOpen(false);
    setProfileModalOpen(true);
  };

  return (
    <>
      <header className="navbar">
        {/* Logo */}
        <div className="brand">
          <img src={logo} alt="MagangKu" />
        </div>

        {/* Navigation */}
        <nav className="nav-links">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            Beranda
          </NavLink>

          <NavLink
            to="/cari-lowongan"
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
          >
            Cari Lowongan
          </NavLink>
        </nav>

        {/* User Menu */}
        <div className="user-menu">
          <img
            src={profile.photo || userPhoto}
            alt={profile.name}
            onClick={openProfileOnly}
            className="profile-photo"
          />

          <span>{profile.name}</span>

          <button
            className="dropdown-toggle"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <ChevronDown size={16} />
          </button>

          {dropdownOpen && (
            <div className="dropdown">
              <NavLink to="/lowongan-disimpan">
                <Bookmark size={16} />
                Simpan Lowongan
              </NavLink>

              <button onClick={openProfileOnly}>
                <Settings size={16} />
                Pengaturan
              </button>

              <NavLink to="/tentang-kami">
                <Info size={16} />
                Tentang Kami
              </NavLink>

              <button
                className="danger"
                onClick={() => setLogoutModalOpen(true)}
              >
                <LogOut size={16} />
                Keluar
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Logout Modal */}
      {logoutModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <LogOut size={44} className="modal-icon" />
            <p>Anda yakin ingin logout?</p>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setLogoutModalOpen(false)}
              >
                Batal
              </button>

              <button className="danger-btn" onClick={handleLogout}>
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {profileModalOpen && (
        <ProfileModal
          showEditButton={true}
          onClose={() => setProfileModalOpen(false)}
        />
      )}
    </>
  );
}

export default Navbar;