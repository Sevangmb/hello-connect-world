
import { Suitcase } from "@/components/suitcases/utils/types";
import { SuitcaseCard } from "./SuitcaseCard";
import { SuitcaseListItem } from "./SuitcaseListItem";

interface SuitcaseGridProps {
  suitcases: Suitcase[];
  viewMode: "grid" | "list";
  selectedSuitcaseId: string | undefined;
  setSelectedSuitcaseId: (id: string | undefined) => void;
}

export const SuitcaseGrid = ({
  suitcases,
  viewMode,
  selectedSuitcaseId,
  setSelectedSuitcaseId,
}: SuitcaseGridProps) => {
  if (!suitcases.length) return null;

  return (
    <div className={viewMode === "grid" ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" : ""}>
      {suitcases.map((suitcase) => 
        viewMode === "grid" ? (
          <SuitcaseCard
            key={suitcase.id}
            suitcase={suitcase}
            isSelected={selectedSuitcaseId === suitcase.id}
            onSelect={setSelectedSuitcaseId}
          />
        ) : (
          <SuitcaseListItem
            key={suitcase.id}
            suitcase={suitcase}
            isSelected={selectedSuitcaseId === suitcase.id}
            onSelect={setSelectedSuitcaseId}
          />
        )
      )}
    </div>
  );
};
