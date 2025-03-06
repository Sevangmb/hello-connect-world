
interface SuitcaseItemsHeaderProps {
  itemCount: number;
  isLoading: boolean;
}

export const SuitcaseItemsHeader: React.FC<SuitcaseItemsHeaderProps> = ({ 
  itemCount, 
  isLoading 
}) => {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold">
        {isLoading ? 'Chargement...' : `${itemCount} articles`}
      </h3>
    </div>
  );
};
