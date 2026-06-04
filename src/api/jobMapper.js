export const mapInternshipToJob = (item) => {
  return {
    id: item.id,
    title: item.title,
    company: item.company?.name || "-",
    type: item.type,
    location: item.location,
    description: item.description,
    requirements: item.requirements,
    registrationUrl: item.registration_url,
    status: item.status,
    openDate: item.open_date,
    closeDate: item.close_date,
    logo: item.company?.logo_url || "",
    companyData: item.company,
  };
};