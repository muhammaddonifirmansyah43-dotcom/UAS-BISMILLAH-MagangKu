import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  CalendarDays,
  Image,
  Link as LinkIcon,
  Mail,
  MapPin,
  Save,
} from "lucide-react";

import api from "../../api/api";
import "../../index.css";

function TambahLowongan() {
  const navigate = useNavigate();

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [logoPreview, setLogoPreview] = useState("");

  const [formData, setFormData] = useState({
    company_name: "",
    company_email: "",
    company_description: "",
    title: "",
    type: "Magang",
    location: "",
    description: "",
    requirements: "",
    registration_url: "",
    status: "open",
    close_date: "",
  });

  const [errors, setErrors] = useState({});

  const handleBack = () => {
    navigate("/admin/dashboard");
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate("/admin/dashboard");
  };

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

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.company_name.trim()) {
      newErrors.company_name = "Nama perusahaan wajib diisi";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Nama lowongan wajib diisi";
    }

    if (!formData.type) {
      newErrors.type = "Tipe lowongan wajib dipilih";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Lokasi wajib diisi";
    }

    if (!formData.close_date) {
      newErrors.close_date = "Deadline wajib diisi";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Deskripsi lowongan wajib diisi";
    }

    if (!formData.requirements.trim()) {
      newErrors.requirements = "Persyaratan wajib diisi";
    }

    if (!formData.company_description.trim()) {
      newErrors.company_description = "Tentang perusahaan wajib diisi";
    }

    if (!formData.registration_url.trim()) {
      newErrors.registration_url = "Link pendaftaran wajib diisi";
    }

    if (!formData.company_email.trim()) {
      newErrors.company_email = "Email pendaftaran wajib diisi";
    }

    return newErrors;
  };

  const findOrCreateCompany = async () => {
    const companiesResponse = await api.get("/companies");
    const companies = companiesResponse.data.data || [];

    const existingCompany = companies.find(
      (company) =>
        company.name.toLowerCase() === formData.company_name.toLowerCase()
    );

    if (existingCompany) {
      return existingCompany.id;
    }

    const companyResponse = await api.post("/companies", {
      name: formData.company_name,
      email: formData.company_email,
      phone: "",
      address: formData.location,
      logo_url: "",
      website: formData.registration_url,
      description: formData.company_description,
    });

    return companyResponse.data.data?.id || companyResponse.data.id;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      setLoadingSubmit(true);

      const companyId = await findOrCreateCompany();

      await api.post("/internships", {
        company_id: companyId,
        title: formData.title,
        type: formData.type,
        description: formData.description,
        requirements: formData.requirements,
        location: formData.location,
        registration_url: formData.registration_url,
        status: formData.status,
        open_date: null,
        close_date: formData.close_date || null,
      });

      setShowSuccess(true);
    } catch (error) {
      console.error("Gagal menambah lowongan:", error);

      if (error.response?.status === 401) {
        alert("Sesi login admin habis. Silakan login ulang.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        return;
      }

      alert(
        error.response?.data?.message ||
          `Gagal menambah lowongan. Status: ${
            error.response?.status || "unknown"
          }`
      );
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="admin-job-simple-page">
      <main className="admin-job-simple-container">
        <button
          type="button"
          className="admin-simple-back-btn"
          onClick={handleBack}
        >
          <ArrowLeft size={18} />
        </button>

        <form className="admin-job-form-card" onSubmit={handleSubmit}>
          <h1>Tambah Lowongan</h1>

          {errors.general && (
            <div className="admin-form-alert">{errors.general}</div>
          )}

          <div className="admin-job-field admin-job-field-full">
            <label>Logo perusahaan</label>

            <label className="admin-logo-upload-box">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                hidden
              />

              {logoPreview ? (
                <img src={logoPreview} alt="Preview logo perusahaan" />
              ) : (
                <>
                  <div className="admin-upload-icon-box">
                    <Image size={28} />
                  </div>
                  <p>Upload Logo Perusahaan</p>
                </>
              )}
            </label>
          </div>

          <div className="admin-job-field">
            <label>
              Nama lowongan <span>*</span>
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? "admin-input-error" : ""}
            />

            {errors.title && (
              <small className="admin-error-text">{errors.title}</small>
            )}
          </div>

          <div className="admin-job-field">
            <label>
              Nama perusahaan <span>*</span>
            </label>

            <div className="admin-job-input-icon">
              <Building2 size={14} />
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                className={errors.company_name ? "admin-input-error" : ""}
              />
            </div>

            {errors.company_name && (
              <small className="admin-error-text">{errors.company_name}</small>
            )}
          </div>

          <div className="admin-job-form-grid">
            <div className="admin-job-field">
              <label>
                Tipe <span>*</span>
              </label>

              <div className="admin-job-input-icon">
                <Briefcase size={14} />
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="Magang">Magang</option>
                  <option value="PKL">PKL</option>
                </select>
              </div>
            </div>

            <div className="admin-job-field">
              <label>
                Lokasi <span>*</span>
              </label>

              <div className="admin-job-input-icon">
                <MapPin size={14} />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={errors.location ? "admin-input-error" : ""}
                />
              </div>

              {errors.location && (
                <small className="admin-error-text">{errors.location}</small>
              )}
            </div>
          </div>

          <div className="admin-job-field">
            <label>
              Deadline <span>*</span>
            </label>

            <div className="admin-job-input-icon">
              <CalendarDays size={14} />
              <input
                type="date"
                name="close_date"
                value={formData.close_date}
                onChange={handleChange}
                className={errors.close_date ? "admin-input-error" : ""}
              />
            </div>

            {errors.close_date && (
              <small className="admin-error-text">{errors.close_date}</small>
            )}
          </div>

          <div className="admin-job-field">
            <label>
              Deskripsi lowongan <span>*</span>
            </label>

            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? "admin-input-error" : ""}
            />

            {errors.description && (
              <small className="admin-error-text">{errors.description}</small>
            )}
          </div>

          <div className="admin-job-field">
            <label>
              Persyaratan <span>*</span>
            </label>

            <textarea
              name="requirements"
              rows={4}
              value={formData.requirements}
              onChange={handleChange}
              className={errors.requirements ? "admin-input-error" : ""}
            />

            {errors.requirements && (
              <small className="admin-error-text">{errors.requirements}</small>
            )}
          </div>

          <div className="admin-job-field">
            <label>
              Tentang perusahaan <span>*</span>
            </label>

            <textarea
              name="company_description"
              rows={4}
              value={formData.company_description}
              onChange={handleChange}
              className={errors.company_description ? "admin-input-error" : ""}
            />

            {errors.company_description && (
              <small className="admin-error-text">
                {errors.company_description}
              </small>
            )}
          </div>

          <div className="admin-job-form-grid">
            <div className="admin-job-field">
              <label>
                Link pendaftaran <span>*</span>
              </label>

              <div className="admin-job-input-icon">
                <LinkIcon size={14} />
                <input
                  type="text"
                  name="registration_url"
                  value={formData.registration_url}
                  onChange={handleChange}
                  className={errors.registration_url ? "admin-input-error" : ""}
                />
              </div>

              {errors.registration_url && (
                <small className="admin-error-text">
                  {errors.registration_url}
                </small>
              )}
            </div>

            <div className="admin-job-field">
              <label>
                Email pendaftaran <span>*</span>
              </label>

              <div className="admin-job-input-icon">
                <Mail size={14} />
                <input
                  type="email"
                  name="company_email"
                  value={formData.company_email}
                  onChange={handleChange}
                  className={errors.company_email ? "admin-input-error" : ""}
                />
              </div>

              {errors.company_email && (
                <small className="admin-error-text">
                  {errors.company_email}
                </small>
              )}
            </div>
          </div>

          <div className="admin-job-form-actions">
            <button
              type="button"
              className="admin-job-cancel-btn"
              onClick={handleBack}
            >
              Batal
            </button>

            <button
              type="submit"
              className="admin-job-submit-btn"
              disabled={loadingSubmit}
            >
              <Save size={15} />
              {loadingSubmit ? "Menyimpan..." : "Simpan perubahan"}
            </button>
          </div>
        </form>
      </main>

      {showSuccess && (
        <div className="admin-modal-overlay">
          <div className="admin-success-modal">
            <div className="admin-success-icon">✓</div>
            <h3>Lowongan Berhasil Ditambahkan!</h3>
            <p>Data lowongan baru sudah tersimpan dan akan tampil di dashboard.</p>

            <button type="button" onClick={handleSuccessClose}>
              Selesai
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TambahLowongan;