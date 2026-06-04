import { Trash2 } from "lucide-react";

function DeleteJobModal({ job, onClose, onConfirm, loading }) {
  if (!job) return null;

  return (
    <div className="admin-modal-overlay">
      <div className="admin-confirm-modal">
        <div className="admin-modal-icon danger-dark">
          <Trash2 size={28} />
        </div>

        <h3>Hapus lowongan ini?</h3>
        <p>
          Lowongan <strong>{job.title}</strong> akan dihapus permanen dari sistem.
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
            {loading ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteJobModal;