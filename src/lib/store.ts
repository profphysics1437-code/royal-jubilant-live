"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UIState {
  // Search & filters
  searchTab: "sale" | "rent" | "commercial" | "off-plan";
  setSearchTab: (tab: "sale" | "rent" | "commercial" | "off-plan") => void;

  searchFilters: {
    location: string;
    propertyType: string;
    bedrooms: string;
    minPrice: string;
    maxPrice: string;
    keyword: string;
  };
  setSearchFilters: (f: Partial<UIState["searchFilters"]>) => void;
  resetSearchFilters: () => void;

  // Saved properties (local persistence)
  savedProperties: string[];
  toggleSavedProperty: (id: string) => void;
  isSaved: (id: string) => boolean;

  // Active modals
  activePropertyId: string | null;
  openProperty: (id: string) => void;
  closeProperty: () => void;

  activeAgentId: string | null;
  openAgent: (id: string) => void;
  closeAgent: () => void;

  activeCommunityId: string | null;
  openCommunity: (id: string) => void;
  closeCommunity: () => void;

  activeDeveloperId: string | null;
  openDeveloper: (id: string) => void;
  closeDeveloper: () => void;

  // Mobile menu
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  // Active view (single-page view switcher)
  activeView: string;
  setActiveView: (view: string) => void;

  // Valuation modal
  valuationOpen: boolean;
  setValuationOpen: (open: boolean) => void;

  // Mortgage modal
  mortgageOpen: boolean;
  setMortgageOpen: (open: boolean) => void;

  // Dashboard modal
  dashboardOpen: boolean;
  setDashboardOpen: (open: boolean) => void;

  // Lead form open
  leadFormOpen: boolean;
  leadFormContext: { source: string; propertyRef?: string; agentId?: string } | null;
  openLeadForm: (ctx: { source: string; propertyRef?: string; agentId?: string }) => void;
  closeLeadForm: () => void;
}

const defaultFilters = {
  location: "",
  propertyType: "",
  bedrooms: "",
  minPrice: "",
  maxPrice: "",
  keyword: "",
};

export const useStore = create<UIState>()(
  persist(
    (set, get) => ({
      searchTab: "rent",
      setSearchTab: (tab) => set({ searchTab: tab }),

      searchFilters: defaultFilters,
      setSearchFilters: (f) =>
        set({ searchFilters: { ...get().searchFilters, ...f } }),
      resetSearchFilters: () => set({ searchFilters: defaultFilters }),

      savedProperties: [],
      toggleSavedProperty: (id) => {
        const cur = get().savedProperties;
        const exists = cur.includes(id);
        set({
          savedProperties: exists
            ? cur.filter((p) => p !== id)
            : [...cur, id],
        });
      },
      isSaved: (id) => get().savedProperties.includes(id),

      activePropertyId: null,
      openProperty: (id) => set({ activePropertyId: id }),
      closeProperty: () => set({ activePropertyId: null }),

      activeAgentId: null,
      openAgent: (id) => set({ activeAgentId: id }),
      closeAgent: () => set({ activeAgentId: null }),

      activeCommunityId: null,
      openCommunity: (id) => set({ activeCommunityId: id }),
      closeCommunity: () => set({ activeCommunityId: null }),

      activeDeveloperId: null,
      openDeveloper: (id) => set({ activeDeveloperId: id }),
      closeDeveloper: () => set({ activeDeveloperId: null }),

      mobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

      activeView: "home",
      setActiveView: (view) => {
        set({ activeView: view });
        if (typeof window !== "undefined") {
          // Update URL hash so each page has its own address (#rent, #buy, etc.)
          const hash = view === "home" ? "" : `#/${view}`;
          window.history.pushState({ view }, "", hash === "" ? "/" : `/${hash}`);
          window.scrollTo({ top: 0, behavior: "auto" });
        }
      },

      valuationOpen: false,
      setValuationOpen: (open) => set({ valuationOpen: open }),

      mortgageOpen: false,
      setMortgageOpen: (open) => set({ mortgageOpen: open }),

      dashboardOpen: false,
      setDashboardOpen: (open) => set({ dashboardOpen: open }),

      leadFormOpen: false,
      leadFormContext: null,
      openLeadForm: (ctx) => set({ leadFormOpen: true, leadFormContext: ctx }),
      closeLeadForm: () =>
        set({ leadFormOpen: false, leadFormContext: null }),
    }),
    {
      name: "royal-jubilant-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        savedProperties: state.savedProperties,
        searchTab: state.searchTab,
      }),
    }
  )
);
