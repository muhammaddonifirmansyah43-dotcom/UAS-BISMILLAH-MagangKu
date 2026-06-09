import { useState } from "react";
import { KeyRound, X, Eye, EyeOff } from "lucide-react";

function ResetPasswordModal({ user, onClose, onConfirm, loading }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!user) return null;

  const getInitial = (name) => {
    if (!name) return "U";
    return name.trim().charAt(0).toUpperCase();
  };

  const handleSubmit = () => {
    setError("");

    if (!password.trim()) {
      setError("Password baru wajib diisi");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    if (!confirmPassword.trim()) {
      setError("Konfirmasi password wajib diisi");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak sama");
      return;
    }

    onConfirm(password);
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-reset-modal">
        <div className="admin-reset-header">
          <div className="admin-reset-title">
            <KeyRound size={17} />
            <h3>Reset Password</h3>
          </div>

          <button
            type="button"
            className="admin-reset-close"
            onClick={onClose}
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="admin-reset-user">
          <div className="admin-reset-avatar">
            {user.avatar_url || user.photo ? (
              <img
                src={user.avatar_url || user.photo}
                alt={user.name || "User"}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <span>{getInitial(user.name)}</span>
            )}
          </div>

          <div>
            <h4>{user.name || "-"}</h4>
            <p>{user.email || "-"}</p>
          </div>
        </div>

        <div className="admin-reset-form">
          <label>Password baru</label>
          <div className="admin-reset-password-input">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password baru"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              disabled={loading}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>

          <label>Konfirmasi password</label>
          <div className="admin-reset-password-input">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Ulangi password baru"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
              disabled={loading}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
            >
              {showConfirmPassword ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>

          {error && <small className="admin-reset-error">{error}</small>}

          <p className="admin-reset-note">
            Password user akan langsung diganti. Setelah berhasil, user bisa
            login menggunakan password baru ini.
          </p>
        </div>

        <div className="admin-reset-actions">
          <button
            type="button"
            className="admin-cancel-btn"
            onClick={onClose}
            disabled={loading}
          >
            Batal
          </button>

          <button
            type="button"
            className="admin-reset-send-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Memproses..." : "Reset password"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordModal;