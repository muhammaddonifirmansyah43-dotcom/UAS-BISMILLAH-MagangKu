import { CheckCircle } from "lucide-react";

function OpenJobModal({ job, onClose, onConfirm, loading }) {
  if (!job) return null;

  return (
    <div className="admin-modal-overlay">
      <div className="admin-confirm-modal">
        <div className="admin-modal-icon success">
          <CheckCircle size={28} />
        </div>

        <h3>Buka lowongan ini?</h3>
        <p>
          Lowongan <strong>{job.title}</strong> akan tampil kembali di halaman user.
        </p>

        <div className="admin-modal-actions">
          <button type="button" className="admin-cancel-btn" onClick={onClose}>
            Batal
          </button>

          <button
            type="button"
            className="admin-success-btn"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Memproses..." : "Buka"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OpenJobModal;