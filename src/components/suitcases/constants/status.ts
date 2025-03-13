
import { SuitcaseStatus } from "../types";

// Status options for suitcases
export const SUITCASE_STATUSES: Record<SuitcaseStatus, string> = {
  active: "Active",
  archived: "Archivée"
};

// UI-friendly display statuses (can include additional statuses for UI display)
export const UI_SUITCASE_STATUSES = {
  ...SUITCASE_STATUSES,
  completed: "Terminée" // Only for UI display, not stored in database
};
