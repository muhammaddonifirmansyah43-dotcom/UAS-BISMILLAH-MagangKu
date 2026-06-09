import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

import api from "../api/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    school: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      general: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "nama lengkap wajib di isi";
    }

    if (!formData.email.trim()) {
      newErrors.email = "email wajib di isi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "format email tidak valid";
    }

    if (!formData.school.trim()) {
      newErrors.school = "universitas / sekolah wajib di isi";
    }

    if (!formData.password.trim()) {
      newErrors.password = "password wajib di isi";
    } else if (formData.password.length < 6) {
      newErrors.password = "password minimal 6 karakter";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "konfirmasi password wajib di isi";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "konfirmasi password tidak sama";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoadingSubmit(true);

      await api.post("/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      alert("Registrasi berhasil. Silakan login menggunakan akun yang baru dibuat.");
      navigate("/login");
    } catch (error) {
      console.error("Gagal registrasi:", error);

      if (error.response?.status === 422) {
        const backendErrors = error.response.data.errors || {};
        const formattedErrors = {};

        if (backendErrors.name) {
          formattedErrors.name = backendErrors.name[0];
        }

        if (backendErrors.email) {
          formattedErrors.email = backendErrors.email[0];
        }

        if (backendErrors.password) {
          formattedErrors.password = backendErrors.password[0];
        }

        formattedErrors.general =
          error.response.data.message || "Data registrasi tidak valid.";

        setErrors(formattedErrors);
        return;
      }

      setErrors({
        general:
          error.response?.data?.message ||
          "Registrasi gagal. Pastikan backend sudah berjalan.",
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="register-page">
      <button
        type="button"
        className="register-back-btn"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={22} />
      </button>

      <main className="register-content">
        <h1 className="register-title">Daftar akun baru</h1>

        <form className="register-card" onSubmit={handleSubmit}>
          {errors.general && (
            <small className="error-text" style={{ marginBottom: "10px" }}>
              {errors.general}
            </small>
          )}

          <div className="register-group">
            <label>Nama Lengkap {errors.name && <span>*</span>}</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "input-error" : ""}
            />

            {errors.name && <small className="error-text">{errors.name}</small>}
          </div>

          <div className="register-group">
            <label>Email {errors.email && <span>*</span>}</label>

            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "input-error" : ""}
            />

            {errors.email && (
              <small className="error-text">{errors.email}</small>
            )}
          </div>

          <div className="register-group">
            <label>
              Universitas / Sekolah {errors.school && <span>*</span>}
            </label>

            <input
              type="text"
              name="school"
              value={formData.school}
              onChange={handleChange}
              className={errors.school ? "input-error" : ""}
            />

            {errors.school && (
              <small className="error-text">{errors.school}</small>
            )}
          </div>

          <div className="register-group">
            <label>Password {errors.password && <span>*</span>}</label>

            <div className="register-password">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "input-error" : ""}
              />

              <button
                type="button"
                className="password-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>

            {errors.password && (
              <small className="error-text">{errors.password}</small>
            )}
          </div>

          <div className="register-group">
            <label>
              Konfirmasi Password {errors.confirmPassword && <span>*</span>}
            </label>

            <div className="register-password">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? "input-error" : ""}
              />

              <button
                type="button"
                className="password-eye-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>

            {errors.confirmPassword && (
              <small className="error-text">{errors.confirmPassword}</small>
            )}
          </div>

          <button type="submit" className="register-btn" disabled={loadingSubmit}>
            {loadingSubmit ? "Memproses..." : "Daftar"}
          </button>

          <p className="register-login-text">
            Sudah punya akun? <Link to="/login">Masuk di sini</Link>
          </p>
        </form>
      </main>
    </div>
  );
}

export default Register;