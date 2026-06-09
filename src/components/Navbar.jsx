import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Bookmark,
  Settings,
  Info,
  LogOut,
  ChevronDown,
} from "lucide-react";

import logo from "../assets/Logo_MagangKu.png";
import ProfileModal from "./ProfileModal";
import api from "../api/api";

const defaultProfile = {
  name: "Pengguna",
  email: "pengguna@gmail.com",
  school: "Universitas / Sekolah",
  photo: "",
};

function Navbar() {
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const getProfileKey = () => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    return user.email ? `userProfile_${user.email}` : "userProfile";
  };

  const getCurrentProfile = () => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const userProfile =
      JSON.parse(localStorage.getItem(getProfileKey())) || {};

    return {
      ...defaultProfile,
      name: userProfile.name || user.name || defaultProfile.name,
      email: user.email || userProfile.email || defaultProfile.email,
      school: userProfile.school || defaultProfile.school,
      photo: userProfile.photo || user.avatar_url || "",
    };
  };

  const [profile, setProfile] = useState(getCurrentProfile);

  useEffect(() => {
    const loadProfile = () => {
      setProfile(getCurrentProfile());
    };

    loadProfile();

    window.addEventListener("focus", loadProfile);
    window.addEventListener("profileUpdated", loadProfile);
    window.addEventListener("storage", loadProfile);

    return () => {
      window.removeEventListener("focus", loadProfile);
      window.removeEventListener("profileUpdated", loadProfile);
      window.removeEventListener("storage", loadProfile);
    };
  }, []);

  const getShortName = (name) => {
    if (!name) return "Pengguna";

    const words = name.trim().split(" ");

    if (words.length === 1) {
      return words[0];
    }

    return `${words[0]} ${words[1]}`;
  };

  const getInitial = (name) => {
    if (!name) return "P";
    return name.trim().charAt(0).toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Logout gagal:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("savedJobs");

      setLogoutModalOpen(false);
      setDropdownOpen(false);
      setProfileModalOpen(false);

      navigate("/");
    }
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
          {profile.photo ? (
            <img
              src={profile.photo}
              alt={profile.name}
              onClick={openProfileOnly}
              className="profile-photo"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <button
              type="button"
              className="profile-initial"
              onClick={openProfileOnly}
              title={profile.name}
            >
              {getInitial(profile.name)}
            </button>
          )}

          <span
            onClick={openProfileOnly}
            className="navbar-user-name"
            title={profile.name}
          >
            {getShortName(profile.name)}
          </span>

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