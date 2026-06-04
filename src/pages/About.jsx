import { Mail, Phone, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();

  return (
    <div className="about-login-page">
      <button
        type="button"
        className="about-login-back"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={22} />
      </button>

      <main className="about-login-container">
        <section className="about-login-header">
          <h1>Tentang Kami</h1>
          <p>Mengenal lebih jauh MagangKu</p>
        </section>

        <section className="about-login-section">
          <h2>Apa itu MagangKu?</h2>

          <p>
            MagangKu merupakan platform digital yang dirancang untuk memudahkan
            pengguna, khususnya anak muda usia 16–25 tahun, dalam mencari dan
            melamar lowongan magang secara praktis dan efisien. Dengan tampilan
            yang modern dan user-friendly, website ini menghadirkan pengalaman
            yang nyaman saat digunakan.
          </p>

          <p>
            Menggunakan konsep desain yang elegan dan profesional, website ini
            menampilkan informasi lowongan secara jelas, menarik, dan mudah
            dipahami memberikan kesan up-to-date sesuai dengan kebutuhan
            pengguna masa kini.
          </p>
        </section>

        <section className="about-login-section">
          <h2>Visi & Misi</h2>

          <div className="about-login-grid">
            <div className="about-login-card">
              <span>Visi</span>
              <h3>
                Menjadi teman setia mahasiswa dalam memulai langkah pertama di
                dunia kerja
              </h3>
            </div>

            <div className="about-login-card">
              <span>Misi</span>

              <ol>
                <li>
                  Menyajikan info lowongan dengan bahasa yang mudah dipahami dan
                  komunikatif.
                </li>
                <li>
                  Memberikan update berkala mengenai lowongan magang yang sedang
                  hits.
                </li>
                <li>
                  Menjadi sumber motivasi melalui penyediaan info peluang kerja
                  praktik yang beragam.
                </li>
              </ol>
            </div>
          </div>
        </section>

        <section className="about-login-section">
          <h2>Hubungi Kami</h2>

          <p className="about-login-contact-desc">
            Ada pertanyaan? Jangan ragu untuk menghubungi kami
          </p>

          <div className="about-login-contact-row">
            <div className="about-login-contact-box">
              <Mail size={18} />
              <span>MagangKu@gmail.com</span>
            </div>

            <div className="about-login-contact-box">
              <Phone size={18} />
              <span>+62 812 3456 789</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default About;