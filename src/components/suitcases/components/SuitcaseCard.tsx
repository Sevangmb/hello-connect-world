
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Suitcase } from '../types';
import { CalendarIcon, Trash2, Edit, Eye, ArchiveIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface SuitcaseCardProps {
  suitcase: Suitcase;
  onDelete: (id: string) => void;
  onEdit: (suitcase: Suitcase) => void;
  onArchive: (id: string) => void;
}

export const SuitcaseCard: React.FC<SuitcaseCardProps> = ({ 
  suitcase,
  onDelete,
  onEdit,
  onArchive
}) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/suitcases/${suitcase.id}`);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non défini';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      return 'Date invalide';
    }
  };

  const getStatusBadge = () => {
    switch (suitcase.status) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'archived':
        return <Badge variant="secondary">Archivée</Badge>;
      case 'completed':
        return <Badge variant="success">Terminée</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{suitcase.name}</CardTitle>
          {getStatusBadge()}
        </div>
        {suitcase.description && (
          <CardDescription>{suitcase.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
            <span>Du {formatDate(suitcase.start_date)} au {formatDate(suitcase.end_date)}</span>
          </div>
          <div className="text-sm text-gray-500">
            Créée le {formatDate(suitcase.created_at)}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Button variant="outline" size="sm" onClick={() => handleView()}>
          <Eye className="h-4 w-4 mr-2" />
          Voir
        </Button>
        <div className="space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onEdit(suitcase)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onArchive(suitcase.id)}
          >
            <ArchiveIcon className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onDelete(suitcase.id)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
