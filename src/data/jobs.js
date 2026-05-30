import logoKimiaFarma from "../assets/logo-kimia-farma.jpeg";
import logoAgrowisata from "../assets/logo-agrowisata.jpeg";

export const allJobs = [
  {
    id: 1,
    title: "Product Marketing",
    company: "PT Kusuma Satria Dinasasri Wisatajaya",
    type: "Magang",
    location: "Batu",
    status: "Buka",
    image: logoAgrowisata,
    deadline: "30 Juni 2026",
    isSaved: false,
    description:
      "Membantu tim marketing dalam membuat strategi promosi, mengelola konten, dan melakukan riset pasar untuk kebutuhan perusahaan.",
    requirements: [
      "Siswa/mahasiswa aktif",
      "Tertarik pada bidang marketing",
      "Mampu bekerja dalam tim",
      "Komunikatif dan kreatif",
    ],
  },
  {
    id: 2,
    title: "Admin Klinik",
    company: "PT Kimia Farma",
    type: "PKL",
    location: "Malang",
    status: "Buka",
    image: logoKimiaFarma,
    deadline: "15 Juni 2026",
    isSaved: false,
    description:
      "Membantu kegiatan administrasi klinik, pengarsipan dokumen, input data, dan pelayanan informasi dasar kepada pasien.",
    requirements: [
      "Siswa SMK jurusan Administrasi/Perkantoran/Kesehatan",
      "Teliti dalam mengelola data",
      "Mampu menggunakan komputer dasar",
      "Bertanggung jawab dan disiplin",
    ],
  },
  {
    id: 3,
    title: "Content Creator",
    company: "PT Kusuma Satria Dinasasri Wisatajaya",
    type: "Magang",
    location: "Batu",
    status: "Buka",
    image: logoAgrowisata,
    deadline: "20 Juli 2026",
    isSaved: false,
    description:
      "Membantu membuat ide konten, dokumentasi kegiatan, desain sederhana, dan publikasi konten untuk media sosial perusahaan.",
    requirements: [
      "Memiliki minat pada konten digital",
      "Mampu membuat caption dan ide konten",
      "Menguasai Canva menjadi nilai tambah",
      "Percaya diri dan kreatif",
    ],
  },
  {
    id: 4,
    title: "Staff Administrasi",
    company: "PT Kimia Farma",
    type: "PKL",
    location: "Malang",
    status: "Buka",
    image: logoKimiaFarma,
    deadline: "10 Juli 2026",
    isSaved: false,
    description:
      "Membantu pencatatan data, penyusunan dokumen administrasi, dan pengelolaan arsip operasional perusahaan.",
    requirements: [
      "Siswa/mahasiswa aktif",
      "Teliti dan rapi dalam bekerja",
      "Mampu mengoperasikan Microsoft Office",
      "Memiliki kemampuan komunikasi yang baik",
    ],
  },
  {
    id: 5,
    title: "Teknisi",
    company: "PT Kusuma Satria Dinasasri Wisatajaya",
    type: "Magang",
    location: "Malang",
    status: "Buka",
    image: logoAgrowisata,
    deadline: "25 Juli 2026",
    isSaved: false,
    description:
      "Membantu proses perawatan perangkat, pengecekan alat operasional, serta mendukung kebutuhan teknis di lingkungan kerja.",
    requirements: [
      "Siswa/mahasiswa aktif jurusan terkait",
      "Memiliki minat di bidang teknis",
      "Teliti dan bertanggung jawab",
      "Mampu bekerja secara tim",
    ],
  },
];

export const recommendedJobs = allJobs.slice(0, 2);

export const getInitialSavedJobs = () => {
  const savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
  return savedJobs;
};

export const savedJobsData = [];