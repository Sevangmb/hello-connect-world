
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Suitcase } from '@/components/suitcases/utils/types';
import { SuitcaseActions } from './SuitcaseActions';

interface SuitcaseListItemProps {
  suitcase: Suitcase;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

const SuitcaseListItem: React.FC<SuitcaseListItemProps> = ({ 
  suitcase, 
  onDelete, 
  onEdit 
}) => {
  const formatDate = (date: string | null) => {
    if (!date) return 'Non définie';
    return new Date(date).toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Actif</Badge>;
      case 'archived':
        return <Badge variant="outline">Archivé</Badge>;
      case 'deleted':
        return <Badge variant="destructive">Supprimé</Badge>;
      default:
        return null;
    }
  };

  const timeAgo = (dateString: string) => {
    try {
      return formatDistance(new Date(dateString), new Date(), {
        addSuffix: true,
        locale: fr
      });
    } catch (e) {
      return dateString;
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(suitcase.id);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(suitcase.id);
    }
  };

  const displayDateRange = () => {
    if (!suitcase.start_date && !suitcase.end_date) {
      return 'Aucune date définie';
    }
    
    if (suitcase.start_date && !suitcase.end_date) {
      return `À partir du ${formatDate(suitcase.start_date)}`;
    }
    
    if (!suitcase.start_date && suitcase.end_date) {
      return `Jusqu'au ${formatDate(suitcase.end_date)}`;
    }
    
    return `Du ${formatDate(suitcase.start_date)} au ${formatDate(suitcase.end_date)}`;
  };

  return (
    <div className="border rounded-md p-4 mb-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <Briefcase size={18} className="text-primary" />
          <h3 className="font-medium text-lg">{suitcase.name}</h3>
        </div>
        {getStatusBadge(suitcase.status)}
      </div>
      
      {suitcase.description && (
        <p className="text-sm text-muted-foreground mb-3">{suitcase.description}</p>
      )}
      
      <div className="text-xs text-muted-foreground mb-4">
        <p className="mb-1">{displayDateRange()}</p>
        <p>Créé {timeAgo(suitcase.created_at)}</p>
      </div>
      
      <div className="flex justify-between items-center border-t pt-3">
        <Link to={`/suitcases/${suitcase.id}`}>
          <Button variant="outline" size="sm">
            Voir le détail
          </Button>
        </Link>
        <SuitcaseActions 
          suitcaseId={suitcase.id} 
          onViewCalendar={() => {}}
          onAddItems={() => {}}
        />
      </div>
    </div>
  );
};

export default SuitcaseListItem;
