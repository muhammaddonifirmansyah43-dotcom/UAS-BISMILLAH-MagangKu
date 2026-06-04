import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    navigate("/login");
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
          <div className="register-group">
            <label>
              Nama Lengkap {errors.name && <span>*</span>}
            </label>

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
            <label>
              Email {errors.email && <span>*</span>}
            </label>

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
            <label>
              Password {errors.password && <span>*</span>}
            </label>

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
              <small className="error-text">
                {errors.confirmPassword}
              </small>
            )}
          </div>

          <button type="submit" className="register-btn">
            Daftar
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