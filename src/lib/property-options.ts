// Shared dropdown options for property listing forms (per PropertyFinder spec)

export const COUNTRIES = ["UAE", "Saudi Arabia", "Qatar", "Bahrain", "Egypt", "Oman", "Kuwait"];

export const EMIRATES = [
  "Dubai", "Abu Dhabi", "Sharjah", "Ajman",
  "Ras Al Khaimah", "Fujairah", "Umm Al Quwain",
];

export const DUBAI_COMMUNITIES = [
  "Palm Jumeirah", "Downtown Dubai", "Dubai Marina", "Dubai Creek Harbour",
  "Dubai Hills Estate", "Business Bay", "JBR", "JVC", "Bluewaters Island",
  "Emirates Hills", "Jumeirah Bay Island", "Arabian Ranches", "Tilal Al Ghaf",
  "Madinat Jumeirah Living", "Port de La Mer", "Dubai South", "Arjan",
  "DIFC", "JLT", "Sheikh Zayed Road", "Dubai Investment Park", "Ras Al Khor",
  "Al Quoz", "Mirdif", "Dubai Sports City", "Jumeirah Golf Estates",
  "Mudon", "The Springs", "The Lakes", "The Meadows",
];

export const RESIDENTIAL_TYPES = ["Apartment", "Villa", "Penthouse", "Townhouse", "Studio", "Mansion", "Duplex", "Compound", "Private Room", "Bed Space"];
export const COMMERCIAL_TYPES = ["Office", "Retail", "Warehouse", "Labor Camp", "Shop", "Factory"];

export const COMPLETION_STATUSES = ["Ready", "Off-Plan"];

export const FURNISHING_STATUSES = ["Furnished", "Unfurnished", "Partially Furnished"];

export const RENT_FREQUENCIES = ["Yearly", "Monthly", "Weekly", "Daily"];

export const CHEQUE_OPTIONS = [1, 2, 3, 4, 6, 12];

export const BEDROOM_OPTIONS = [
  { label: "Studio", value: "0" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
  { label: "7+", value: "7" },
];

export const BATHROOM_OPTIONS = ["1", "2", "3", "4", "5", "6+"];
