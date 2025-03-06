
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Briefcase } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Suitcase } from '@/components/suitcases/utils/types';
import { SuitcaseActions } from './SuitcaseActions';

interface SuitcaseCardProps {
  suitcase: Suitcase;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

const SuitcaseCard: React.FC<SuitcaseCardProps> = ({ suitcase, onDelete, onEdit }) => {
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
    <Card className="overflow-hidden transition-shadow hover:shadow-md h-full flex flex-col">
      <CardHeader className="bg-muted pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <Briefcase size={20} className="text-primary" />
            <h3 className="font-medium text-lg">{suitcase.name}</h3>
          </div>
          {getStatusBadge(suitcase.status)}
        </div>
      </CardHeader>
      <CardContent className="pt-4 flex-grow">
        {suitcase.description && (
          <p className="text-sm text-muted-foreground mb-4">{suitcase.description}</p>
        )}
        <div className="text-xs text-muted-foreground">
          <p className="mb-1">{displayDateRange()}</p>
          <p>Créé {timeAgo(suitcase.created_at)}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-3 bg-muted/20">
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
      </CardFooter>
    </Card>
  );
};

export default SuitcaseCard;
