import { Trash2 } from "lucide-react";

function DeleteModal({ onCancel, onConfirm }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <Trash2 size={42} className="modal-icon" />

        <p>Hapus lowongan?</p>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onCancel}>
            Batal
          </button>

          <button className="danger-btn" onClick={onConfirm}>
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;