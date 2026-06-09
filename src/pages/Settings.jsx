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
import api from "../api/api";

const defaultProfile = {
  name: "Pengguna",
  email: "pengguna@gmail.com",
  school: "Universitas / Sekolah",
  photo: "",
};

function Settings() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const adminEmail = "magangku18@gmail.com";

  const forgotPasswordMailto = `mailto:${adminEmail}?subject=Permintaan Reset Password MagangKu&body=Halo Admin MagangKu,%0A%0ASaya lupa password akun saya.%0A%0ANama:%0AEmail akun:%0A%0AMohon bantu reset password saya.%0A%0ATerima kasih.`;

  const getInitial = (name) => {
    if (!name) return "P";
    return name.trim().charAt(0).toUpperCase();
  };

  const getProfileKey = () => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    return user.email ? `userProfile_${user.email}` : "userProfile";
  };

  const getCurrentProfile = () => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const storedProfile =
      JSON.parse(localStorage.getItem(getProfileKey())) || {};

    return {
      ...defaultProfile,
      name: storedProfile.name || user.name || defaultProfile.name,
      email: user.email || storedProfile.email || defaultProfile.email,
      school: storedProfile.school || defaultProfile.school,
      photo: storedProfile.photo || user.avatar_url || "",
    };
  };

  const [formData, setFormData] = useState(getCurrentProfile);

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setFormData(getCurrentProfile());
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

    const updatedProfile = {
      name: formData.name,
      email: formData.email,
      school: formData.school,
      photo: formData.photo,
    };

    const user = JSON.parse(localStorage.getItem("user")) || {};

    const updatedUser = {
      ...user,
      name: formData.name,
      email: formData.email,
      avatar_url: formData.photo || user.avatar_url || "",
    };

    localStorage.setItem(getProfileKey(), JSON.stringify(updatedProfile));
    localStorage.setItem("user", JSON.stringify(updatedUser));

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
      general: "",
    }));
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.oldPassword.trim()) {
      newErrors.oldPassword = "Password lama wajib di isi";
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

  const handleSavePassword = async (event) => {
    event.preventDefault();

    const validationErrors = validatePasswordForm();

    if (Object.keys(validationErrors).length > 0) {
      setPasswordErrors(validationErrors);
      return;
    }

    try {
      setPasswordLoading(true);

      await api.put("/change-password", {
        old_password: passwordData.oldPassword,
        new_password: passwordData.newPassword,
        new_password_confirmation: passwordData.confirmPassword,
      });

      alert("Password berhasil diperbarui!");

      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setPasswordErrors({});
    } catch (error) {
      console.error("Gagal mengganti password:", error);
      console.log("Status:", error.response?.status);
      console.log("Data error:", error.response?.data);

      if (error.response?.status === 401) {
        alert("Sesi login kamu sudah habis. Silakan login ulang.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      if (error.response?.status === 422) {
        const backendMessage =
          error.response?.data?.message || "Data password tidak valid.";

        setPasswordErrors({
          general: backendMessage,
        });

        return;
      }

      setPasswordErrors({
        general:
          error.response?.data?.message ||
          "Gagal mengganti password. Pastikan backend berjalan.",
      });
    } finally {
      setPasswordLoading(false);
    }
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
                {formData.photo ? (
                  <img src={formData.photo} alt="Foto Profil" />
                ) : (
                  <div className="setting-profile-initial">
                    {getInitial(formData.name)}
                  </div>
                )}

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
            {passwordErrors.general && (
              <small className="error-text" style={{ marginBottom: "10px" }}>
                {passwordErrors.general}
              </small>
            )}

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
                  disabled={passwordLoading}
                />

                <button
                  type="button"
                  className="password-eye-btn"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  disabled={passwordLoading}
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
                    disabled={passwordLoading}
                  />

                  <button
                    type="button"
                    className="password-eye-btn"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    disabled={passwordLoading}
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
                    disabled={passwordLoading}
                  />

                  <button
                    type="button"
                    className="password-eye-btn"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    disabled={passwordLoading}
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
              <a href={forgotPasswordMailto}>{adminEmail}</a>
            </p>

            <button
              type="submit"
              className="setting-save-btn"
              disabled={passwordLoading}
            >
              {passwordLoading ? "Memproses..." : "Simpan password"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default Settings;