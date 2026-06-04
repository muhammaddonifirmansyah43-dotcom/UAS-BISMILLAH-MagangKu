import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Camera,
  Eye,
  EyeOff,
  Info,
  LockKeyhole,
  Settings as SettingsIcon,
  UserCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import userPhoto from "../assets/Karim-Benzema-Profil.jpeg";

const defaultProfile = {
  name: "Karim Benzema",
  email: "karimbenzema@gmail.com",
  school: "Universitas of Santiago de Bernabeu",
  photo: userPhoto,
};

function Settings() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState(defaultProfile);

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordErrors, setPasswordErrors] = useState({});

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const storedProfile = JSON.parse(localStorage.getItem("userProfile"));

    if (storedProfile) {
      setFormData(storedProfile);
    } else {
      localStorage.setItem("userProfile", JSON.stringify(defaultProfile));
      setFormData(defaultProfile);
    }
  }, []);

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

  const handleSaveProfile = (event) => {
    event.preventDefault();

    localStorage.setItem("userProfile", JSON.stringify(formData));
    window.dispatchEvent(new Event("profileUpdated"));

    alert("Profil berhasil disimpan!");
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setPasswordErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.oldPassword.trim()) {
      newErrors.oldPassword = "Password lama";
    }

    if (!passwordData.newPassword.trim()) {
      newErrors.newPassword = "Password baru wajib di isi";
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Password minimal 6 karakter";
    }

    if (!passwordData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Konfirmasi password wajib di isi";
    } else if (passwordData.confirmPassword !== passwordData.newPassword) {
      newErrors.confirmPassword = "Konfirmasi password tidak sama";
    }

    return newErrors;
  };

  const handleSavePassword = (event) => {
    event.preventDefault();

    const validationErrors = validatePasswordForm();

    if (Object.keys(validationErrors).length > 0) {
      setPasswordErrors(validationErrors);
      return;
    }

    alert("Password berhasil diperbarui!");

    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setPasswordErrors({});
  };

  return (
    <div className="setting-page">
      <button
        type="button"
        className="setting-back-btn"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={22} />
      </button>

      <main className="setting-container">
        <h1 className="setting-title">
  <SettingsIcon size={18} />
  Pengaturan
</h1>

        <section className="setting-card">
          <div className="setting-card-header">
            <UserCircle2 size={15} />
            <h2>Edit profil</h2>
          </div>

          <form onSubmit={handleSaveProfile}>
            <div className="setting-profile-top">
              <div className="setting-photo-wrapper" onClick={handlePhotoClick}>
                <img src={formData.photo || userPhoto} alt="Foto Profil" />

                <button type="button" className="setting-camera-btn">
                  <Camera size={13} />
                </button>
              </div>

              <div>
                <h3>{formData.name}</h3>
                <p>Klik ikon kamera untuk ganti foto</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                hidden
              />
            </div>

            <div className="setting-form-group">
              <label>Nama lengkap</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="setting-form-group">
              <label>
                Email <span>*Tidak dapat diubah</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
              />
            </div>

            <div className="setting-form-group">
              <label>Universitas / Sekolah</label>
              <input
                type="text"
                name="school"
                value={formData.school}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="setting-save-btn">
              Simpan perubahan
            </button>
          </form>
        </section>

        <section className="setting-card password-card">
          <div className="setting-card-header">
            <LockKeyhole size={15} />
            <h2>Ganti password</h2>
          </div>

          <form onSubmit={handleSavePassword}>
            <div className="setting-form-group">
              <label>
                Password lama {passwordErrors.oldPassword && <span>*</span>}
              </label>

              <div className="setting-password-input">
                <input
                  type={showOldPassword ? "text" : "password"}
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  className={passwordErrors.oldPassword ? "input-error" : ""}
                />

                <button
                  type="button"
                  className="password-eye-btn"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
              </div>

              {passwordErrors.oldPassword && (
                <small className="error-text">
                  {passwordErrors.oldPassword}
                </small>
              )}
            </div>

            <div className="setting-password-row">
              <div className="setting-form-group">
                <label>
                  Password baru {passwordErrors.newPassword && <span>*</span>}
                </label>

                <div className="setting-password-input">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={passwordErrors.newPassword ? "input-error" : ""}
                  />

                  <button
                    type="button"
                    className="password-eye-btn"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                </div>

                {passwordErrors.newPassword && (
                  <small className="error-text">
                    {passwordErrors.newPassword}
                  </small>
                )}
              </div>

              <div className="setting-form-group">
                <label>
                  Konfirmasi password{" "}
                  {passwordErrors.confirmPassword && <span>*</span>}
                </label>

                <div className="setting-password-input">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={
                      passwordErrors.confirmPassword ? "input-error" : ""
                    }
                  />

                  <button
                    type="button"
                    className="password-eye-btn"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    {showConfirmPassword ? (
                      <Eye size={15} />
                    ) : (
                      <EyeOff size={15} />
                    )}
                  </button>
                </div>

                {passwordErrors.confirmPassword && (
                  <small className="error-text">
                    {passwordErrors.confirmPassword}
                  </small>
                )}
              </div>
            </div>

            <p className="setting-forgot">
              <Info size={13} />
              Lupa password? Hubungi admin{" "}
              <a href="mailto:@magangku.com">@magangku.com</a>
            </p>

            <button type="submit" className="setting-save-btn">
              Simpan password
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default Settings;