import { KeyRound, X, Mail } from "lucide-react";

function ResetPasswordModal({ user, onClose, onConfirm, loading }) {
  if (!user) return null;

  return (
    <div className="admin-modal-overlay">
      <div className="admin-reset-modal">
        <div className="admin-reset-header">
          <div className="admin-reset-title">
            <KeyRound size={17} />
            <h3>Reset Password</h3>
          </div>

          <button type="button" className="admin-reset-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="admin-reset-user">
          <div className="admin-reset-avatar">
            {user.photo ? (
              <img src={user.photo} alt={user.name} />
            ) : (
              <span>{user.name.charAt(0)}</span>
            )}
          </div>

          <div>
            <h4>{user.name}</h4>
            <p>{user.email}</p>
          </div>
        </div>

        <div className="admin-reset-info">
          <Mail size={16} />
          <div>
            <h5>Link reset akan dikirim via email</h5>
            <p>
              Pengguna akan menerima tautan untuk membuat password baru. Tautan
              berlaku selama 24 jam.
            </p>
          </div>
        </div>

        <div className="admin-reset-actions">
          <button type="button" className="admin-cancel-btn" onClick={onClose}>
            Batal
          </button>

          <button
            type="button"
            className="admin-reset-send-btn"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Mengirim..." : "Kirim reset password"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordModal;