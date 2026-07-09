"use client";

interface Option { label: string; value: string; }

export function CheckboxGrid({
  options,
  selected,
  onChange,
  columns = 3,
}: {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  columns?: 2 | 3 | 4;
}) {
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const colsClass = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
  }[columns];

  return (
    <div className={`grid ${colsClass} gap-2`}>
      {options.map((opt) => {
        const isSelected = selected.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all text-left ${
              isSelected
                ? "bg-royal-gradient-diagonal text-white border-transparent shadow-sm"
                : "bg-[#F9FAFB] text-[#0A1F44] border-border hover:border-[#C9A961]"
            }`}
          >
            <span className={`size-4 rounded border flex items-center justify-center flex-shrink-0 ${
              isSelected ? "bg-white border-white" : "border-muted-foreground/40"
            }`}>
              {isSelected && (
                <svg className="size-3 text-[#0A1F44]" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6.5L5 9L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </span>
            <span className="flex-1 leading-tight">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// Predefined options per the PropertyFinder spec
export const INDOOR_FEATURES: Option[] = [
  "Central A/C", "Maids Room", "Study Room", "Walk-in Closet",
  "Built-in Wardrobes", "Kitchen Appliances", "Pets Allowed",
  "Private Jacuzzi", "Laundry Room",
].map((v) => ({ label: v, value: v }));

export const OUTDOOR_FEATURES: Option[] = [
  "Private Garden", "Private Pool", "Private Gym", "Private Garage",
  "Terrace", "Balcony", "BBQ Area",
].map((v) => ({ label: v, value: v }));

export const BUILDING_AMENITIES: Option[] = [
  "Shared Pool", "Shared Spa", "Shared Gym", "Security", "Concierge",
  "Children's Play Area", "Beach Access", "Covered Parking",
  "Visitor Parking", "Mosque", "Retail",
].map((v) => ({ label: v, value: v }));

export const NEARBY_LANDMARKS: Option[] = [
  "Metro", "School", "Hospital", "Mall", "Airport", "Beach", "Park",
].map((v) => ({ label: v, value: v }));

export const VIEW_OPTIONS: Option[] = [
  "Sea View", "Burj Khalifa View", "City View", "Pool View",
  "Garden View", "Community View",
].map((v) => ({ label: v, value: v }));
