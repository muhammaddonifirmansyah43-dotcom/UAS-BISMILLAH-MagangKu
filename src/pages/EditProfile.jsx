import { useRef, useState } from "react";
import { ArrowLeft, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import defaultPhoto from "../assets/Karim-Benzema-Profil.jpeg";

function EditProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState(() => {
    const savedProfile = JSON.parse(localStorage.getItem("userProfile"));

    return (
      savedProfile || {
        name: "Karim Benzema",
        email: "karimbenzema@gmail.com",
        school: "Universitas of Santiago de Bernabeu",
        photo: defaultPhoto,
      }
    );
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((prevData) => ({
        ...prevData,
        photo: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    localStorage.setItem("userProfile", JSON.stringify(formData));
    window.dispatchEvent(new Event("profileUpdated"));

    alert("Profil berhasil disimpan!");
  };

  return (
    <div className="page edit-profile-page">
      <main className="edit-profile-container">
        <section className="edit-profile-card">
          <button className="detail-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>

          <div className="edit-profile-photo">
            <img src={formData.photo || defaultPhoto} alt={formData.name} />

            <button
              type="button"
              className="camera-btn"
              onClick={handlePhotoClick}
            >
              <Camera size={14} />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              hidden
            />
          </div>

          <form className="edit-profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nama Lengkap</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Universitas / Sekolah</label>
              <input
                type="text"
                name="school"
                value={formData.school}
                onChange={handleChange}
              />
            </div>

            <div className="edit-profile-actions">
              <button type="submit" className="primary-btn">
                Simpan
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default EditProfile;