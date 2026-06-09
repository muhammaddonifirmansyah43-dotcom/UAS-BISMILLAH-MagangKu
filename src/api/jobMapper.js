const API_URL = "http://127.0.0.1:8000";

const getCompanyLogo = (item) => {
  const logoUrl = item.company?.logo_url || "";

  if (logoUrl.startsWith("http")) {
    return logoUrl;
  }

  if (logoUrl.startsWith("/")) {
    return `${API_URL}${logoUrl}`;
  }

  const companyName = item.company?.name || "";

  if (companyName.toLowerCase().includes("kimia")) {
    return "/images/logo-kimia-farma.jpeg";
  }

  if (
    companyName.toLowerCase().includes("kusuma") ||
    companyName.toLowerCase().includes("wisata")
  ) {
    return "/images/logo-agrowisata.jpeg";
  }

  if (companyName.toLowerCase().includes("bnn")) {
    return "/images/logo-bnn.jpeg";
  }

  return "/images/logo-agrowisata.jpeg";
};

export const mapInternshipToJob = (item) => {
  return {
    id: item.id,
    title: item.title || "",
    company: item.company?.name || item.company_name || "-",
    type: item.type || "",
    location: item.location || "",
    description: item.description || "",
    requirements: item.requirements || "",
    registrationUrl: item.registration_url || "",
    status: item.status || "open",
    openDate: item.open_date || "",
    closeDate: item.close_date || "",
    logo: getCompanyLogo(item),
    companyData: item.company,
  };
};

export const mapInternshipsToJobs = (items = []) => {
  return items.map(mapInternshipToJob);
};