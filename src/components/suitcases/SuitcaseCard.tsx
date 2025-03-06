
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Calendar, ArrowRightCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { SuitcaseActions } from './components/SuitcaseActions';

interface SuitcaseCardProps {
  suitcase: {
    id: string;
    name: string;
    status: string;
    start_date: string | null;
    end_date: string | null;
    item_count?: number;
  };
  isSelected?: boolean;
  onSelect?: () => void;
}

const SuitcaseCard: React.FC<SuitcaseCardProps> = ({ suitcase, isSelected, onSelect }) => {
  const formatDateRange = () => {
    if (!suitcase.start_date && !suitcase.end_date) {
      return "Aucune date définie";
    }

    if (suitcase.start_date && !suitcase.end_date) {
      return `À partir du ${format(new Date(suitcase.start_date), 'dd MMMM yyyy', { locale: fr })}`;
    }

    if (!suitcase.start_date && suitcase.end_date) {
      return `Jusqu'au ${format(new Date(suitcase.end_date), 'dd MMMM yyyy', { locale: fr })}`;
    }

    return `${format(new Date(suitcase.start_date!), 'dd MMM', { locale: fr })} - ${format(new Date(suitcase.end_date!), 'dd MMM yyyy', { locale: fr })}`;
  };

  const getStatusColor = () => {
    switch (suitcase.status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      case 'planned':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = () => {
    switch (suitcase.status) {
      case 'active':
        return 'Active';
      case 'archived':
        return 'Archivée';
      case 'planned':
        return 'Planifiée';
      default:
        return 'Indéfini';
    }
  };

  return (
    <Card 
      className={`overflow-hidden transition-all hover:shadow-md ${isSelected ? 'border-primary ring-2 ring-primary/20' : ''}`}
      onClick={onSelect}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-muted-foreground" />
            <span className="truncate max-w-[180px]">{suitcase.name}</span>
          </div>
          <Badge className={getStatusColor()}>{getStatusLabel()}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
          <Calendar className="h-4 w-4" />
          <span>{formatDateRange()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {suitcase.item_count || 0} article{(suitcase.item_count !== 1) ? 's' : ''}
          </span>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            // Navigate logic here
          }}
          className="text-primary"
        >
          Voir <ArrowRightCircle className="ml-1 h-4 w-4" />
        </Button>
        <SuitcaseActions suitcaseId={suitcase.id} />
      </CardFooter>
    </Card>
  );
};

export default SuitcaseCard;
