import { XCircle } from "lucide-react";

function CloseJobModal({ job, onClose, onConfirm, loading }) {
  if (!job) return null;

  return (
    <div className="admin-modal-overlay">
      <div className="admin-confirm-modal">
        <div className="admin-modal-icon danger">
          <XCircle size={28} />
        </div>

        <h3>Tutup lowongan ini?</h3>
        <p>
          Lowongan <strong>{job.title}</strong> tidak akan tampil di halaman user.
        </p>

        <div className="admin-modal-actions">
          <button type="button" className="admin-cancel-btn" onClick={onClose}>
            Batal
          </button>

          <button
            type="button"
            className="admin-danger-btn"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Memproses..." : "Tutup"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CloseJobModal;