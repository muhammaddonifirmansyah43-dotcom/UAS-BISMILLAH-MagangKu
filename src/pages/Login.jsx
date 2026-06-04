import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logo from "../assets/Logo_MagangKu.png";
import api from "../api/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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

    if (!formData.username.trim()) {
      newErrors.username = "email / nama pengguna wajib di isi";
    }

    if (!formData.password.trim()) {
      newErrors.password = "password wajib di isi";
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
      setLoading(true);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      const response = await api.post("/login", {
        email: formData.username.trim(),
        password: formData.password,
      });

      const token = response.data.token;
      const user = response.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login gagal:", error);

      setErrors({
        general: "Email atau password salah",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <main className="login-content">
        <img src={logo} alt="MagangKu" className="login-logo" />

        <h1 className="login-title">Selamat Datang</h1>

        <form className="login-card" onSubmit={handleSubmit}>
          <div className="login-group">
            <label>
              Email / Nama Pengguna{" "}
              {(errors.username || errors.general) && <span>*</span>}
            </label>

            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={
                errors.username || errors.general ? "input-error" : ""
              }
              autoComplete="email"
            />

            {errors.username && (
              <small className="error-text">{errors.username}</small>
            )}
          </div>

          <div className="login-group">
            <label>
              Password {(errors.password || errors.general) && <span>*</span>}
            </label>

            <div className="login-password">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={
                  errors.password || errors.general ? "input-error" : ""
                }
                autoComplete="current-password"
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

          {errors.general && (
            <small className="error-text login-general-error">
              {errors.general}
            </small>
          )}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Memuat..." : "Masuk"}
          </button>

          <p className="forgot-password">
            Lupa password? Hubungi admin
            <br />
            <a href="mailto:@magangku.com">@magangku.com</a>
          </p>

          <div className="login-divider"></div>

          <p className="login-register">
            Belum punya akun? <Link to="/register">daftar disini</Link>
          </p>
        </form>
      </main>
    </div>
  );
}

export default Login;