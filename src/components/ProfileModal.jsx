import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import defaultPhoto from "../assets/Karim-Benzema-Profil.jpeg";

const defaultProfile = {
  name: "Karim Benzema",
  email: "karimbenzema@gmail.com",
  school: "Universitas of Santiago de Bernabeu",
  photo: defaultPhoto,
};

const getStoredProfile = () => {
  try {
    return JSON.parse(localStorage.getItem("userProfile")) || defaultProfile;
  } catch {
    return defaultProfile;
  }
};

function ProfileModal({ onClose, showEditButton = false }) {
  const navigate = useNavigate();
  const profile = getStoredProfile();

  const handleEditProfile = () => {
    onClose();
    navigate("/edit-profil");
  };

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal-box">
        <button className="profile-modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="profile-modal-photo">
          <img src={profile.photo || defaultPhoto} alt={profile.name} />
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