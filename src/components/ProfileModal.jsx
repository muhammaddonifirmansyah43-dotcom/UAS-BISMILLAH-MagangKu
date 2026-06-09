import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const defaultProfile = {
  name: "Pengguna",
  email: "pengguna@gmail.com",
  school: "Universitas / Sekolah",
  photo: "",
};

const getProfileKey = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  return user.email ? `userProfile_${user.email}` : "userProfile";
};

const getStoredProfile = () => {
  try {
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
  } catch {
    return defaultProfile;
  }
};

function ProfileModal({ onClose, showEditButton = false }) {
  const navigate = useNavigate();
  const profile = getStoredProfile();

  const getInitial = (name) => {
    if (!name) return "P";
    return name.trim().charAt(0).toUpperCase();
  };

  const handleEditProfile = () => {
    onClose();
    navigate("/settings");
  };

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal-box">
        <button
          type="button"
          className="profile-modal-close"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <div className="profile-modal-photo">
          {profile.photo ? (
            <img
              src={profile.photo}
              alt={profile.name}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="profile-modal-initial">
              {getInitial(profile.name)}
            </div>
          )}
        </div>

        <div className="profile-modal-form">
          <label>Nama Lengkap</label>
          <div className="profile-modal-input">{profile.name}</div>

          <label>Email</label>
          <div className="profile-modal-input">{profile.email}</div>

          <label>Universitas/Sekolah</label>
          <div className="profile-modal-input">{profile.school}</div>
        </div>

        {showEditButton && (
          <button
            type="button"
            className="profile-modal-edit-btn"
            onClick={handleEditProfile}
          >
            Edit Profil
          </button>
        )}
      </div>
    </div>
  );
}

export default ProfileModal;