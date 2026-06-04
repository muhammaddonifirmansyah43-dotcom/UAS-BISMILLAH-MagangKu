import { NavLink, Link } from "react-router-dom";
import logo from "../assets/Logo_MagangKu.png";

function NavbarGuest() {
  return (
    <header className="navbar">
      <div className="brand">
        <img src={logo} alt="MagangKu" />
      </div>

      <nav className="nav-links">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Beranda
        </NavLink>

        <NavLink
          to="/tentang-kami"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          Tentang Kami
        </NavLink>
      </nav>

      <div className="nav-buttons">
        <Link to="/login" className="btn-secondary">
          Masuk
        </Link>

        <Link to="/register" className="btn-primary">
          Daftar
        </Link>
      </div>
    </header>
  );
}

export default NavbarGuest;