import { Link, useNavigate } from "react-router-dom";

function JobDetailGuest() {
  const navigate = useNavigate();

  return (
    <div className="detail-page">
      <main className="detail-container">
        <div className="guest-login-modal guest-detail-access-card">
          <div className="guest-login-icon">🔒</div>

          <h2>Membutuhkan akses</h2>

          <p>Silakan login terlebih dahulu untuk melihat detail lowongan ini.</p>

          <Link to="/login" className="guest-login-btn">
            Login sekarang
          </Link>

          <Link to="/register" className="guest-register-btn">
            Daftar akun
          </Link>

          <button
            type="button"
            className="guest-later-btn"
            onClick={() => navigate("/cari-lowongan")}
          >
            Nanti saja
          </button>
        </div>
      </main>
    </div>
  );
}

export default JobDetailGuest;