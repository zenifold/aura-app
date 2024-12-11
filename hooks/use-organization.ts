import { create } from "zustand";

interface OrganizationStore {
  organization: Record<string, any> | null;
  setOrganization: (organization: Record<string, any>) => void;
}

export const useOrganization = create<OrganizationStore>((set) => ({
  organization: null,
  setOrganization: (organization) => set({ organization }),
}));
