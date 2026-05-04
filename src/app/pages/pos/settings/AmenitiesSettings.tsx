import { useState } from "react";
import { Check } from "lucide-react";
import { useThemeClasses } from "../theme-context";
import { AMENITIES, CUISINES, OCCASIONS, SEATING_PREFERENCES } from "./data";

type OptionItem = { id: string; label: string; icon: React.ComponentType<{ className?: string }> };

interface OptionSectionProps {
  title: string;
  description: string;
  items: OptionItem[];
  enabled: Record<string, boolean>;
  toggle: (id: string) => void;
}

function OptionSection({ title, description, items, enabled, toggle }: OptionSectionProps) {
  const tc = useThemeClasses();
  const enabledCount = items.filter((i) => enabled[i.id]).length;

  return (
    <div className={`${tc.card} rounded-lg`}>
      <div className={`p-4 sm:p-5 border-b ${tc.cardBorder}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h3 className={`text-[0.9375rem] ${tc.heading}`}>{title}</h3>
            <p className={`text-[0.75rem] ${tc.subtext} mt-0.5`}>{description}</p>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-400 text-[0.6875rem] shrink-0">{enabledCount} active</span>
        </div>
      </div>
      <div className="p-3 sm:p-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {items.map((a) => {
            const isOn = !!enabled[a.id];
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => toggle(a.id)}
                className={`relative flex flex-col items-center justify-center gap-2 p-3 rounded-lg border transition-all cursor-pointer text-center ${
                  isOn
                    ? `border-blue-500 ${tc.isDark ? "bg-blue-900/20" : "bg-blue-50"}`
                    : `${tc.cardBorder} ${tc.hover}`
                }`}
              >
                {isOn && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" strokeWidth={3} />
                  </span>
                )}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isOn ? tc.iconBg : tc.disabledIconBg}`}>
                  <a.icon className="w-4 h-4" />
                </div>
                <span className={`text-[0.75rem] leading-tight ${isOn ? (tc.isDark ? "text-blue-200" : "text-blue-700") : (tc.isDark ? "text-gray-200" : "text-gray-700")}`}>{a.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function AmenitiesSettings() {
  const [amenityEnabled, setAmenityEnabled] = useState<Record<string, boolean>>({
    parking: true, wifi: true, "credit-cards": true, cash: true, "mobile-pay": true,
    "high-chairs": true, "kids-menu": true, reservations: true, "walk-ins": true,
    outdoor: true, ac: true, "bar-lounge": true, takeout: true,
  });
  const [cuisineEnabled, setCuisineEnabled] = useState<Record<string, boolean>>({
    "grilled-beef": true, seafood: true, "family-meal": true,
  });
  const [occasionEnabled, setOccasionEnabled] = useState<Record<string, boolean>>({
    "casual-dining": true, "family-friendly": true,
  });
  const [seatingEnabled, setSeatingEnabled] = useState<Record<string, boolean>>({
    "dining-hall": true, "window-seat": true,
  });

  const makeToggle = (setter: React.Dispatch<React.SetStateAction<Record<string, boolean>>>) =>
    (id: string) => setter((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="space-y-4">
      <OptionSection
        title="Amenities & Services"
        description="Toggle features and services your restaurant offers"
        items={AMENITIES}
        enabled={amenityEnabled}
        toggle={makeToggle(setAmenityEnabled)}
      />
      <OptionSection
        title="Cuisine"
        description="Select the cuisine types your restaurant serves"
        items={CUISINES}
        enabled={cuisineEnabled}
        toggle={makeToggle(setCuisineEnabled)}
      />
      <OptionSection
        title="Occasion & Vibe"
        description="Highlight the occasions and vibes your restaurant fits best"
        items={OCCASIONS}
        enabled={occasionEnabled}
        toggle={makeToggle(setOccasionEnabled)}
      />
      <OptionSection
        title="Seating Preference"
        description="Seating options available to your guests"
        items={SEATING_PREFERENCES}
        enabled={seatingEnabled}
        toggle={makeToggle(setSeatingEnabled)}
      />
    </div>
  );
}
