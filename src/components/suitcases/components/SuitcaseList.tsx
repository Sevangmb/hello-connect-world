
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Luggage, MapPin, Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SuitcaseWithStats } from '../types';

interface SuitcaseListProps {
  suitcases: SuitcaseWithStats[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const SuitcaseList: React.FC<SuitcaseListProps> = ({ suitcases, onEdit, onDelete }) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return null;
    try {
      return format(new Date(dateString), 'PPP', { locale: fr });
    } catch {
      return null;
    }
  };

  const handleCardClick = (id: string) => {
    navigate(`/valises/${id}`);
  };

  if (suitcases.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <Luggage className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Aucune valise trouvée</h3>
        <p className="text-gray-500 mb-4">
          Vous n'avez pas encore créé de valise. Créez votre première valise pour
          commencer à organiser vos voyages.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {suitcases.map((suitcase) => (
        <Card 
          key={suitcase.id} 
          className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleCardClick(suitcase.id)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold truncate">{suitcase.name}</h3>
              <Badge 
                variant={suitcase.status === 'active' ? 'default' : 'secondary'}
              >
                {suitcase.status === 'active' ? 'Active' : 'Archivée'}
              </Badge>
            </div>
            
            {suitcase.description && (
              <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                {suitcase.description}
              </p>
            )}
            
            <div className="space-y-2 text-sm">
              {suitcase.destination && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{suitcase.destination}</span>
                </div>
              )}
              
              {(suitcase.start_date || suitcase.end_date) && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>
                    {formatDate(suitcase.start_date)}
                    {suitcase.start_date && suitcase.end_date && ' - '}
                    {formatDate(suitcase.end_date)}
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Luggage className="h-4 w-4 text-gray-400" />
                <span>{suitcase.item_count || 0} articles</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="bg-gray-50 p-3 flex justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(suitcase.id);
              }}
            >
              <Pencil className="h-4 w-4 mr-1" />
              Modifier
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(suitcase.id);
              }}
            >
              <Trash className="h-4 w-4 mr-1" />
              Supprimer
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
