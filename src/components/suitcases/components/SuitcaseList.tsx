
import React from 'react';
import { Luggage, Calendar, MapPin, Edit, Trash } from 'lucide-react';
import { SuitcaseListProps } from '../types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

export const SuitcaseList: React.FC<SuitcaseListProps> = ({ 
  suitcases,
  onEdit,
  onDelete
}) => {
  if (!suitcases || suitcases.length === 0) {
    return (
      <div className="text-center py-10">
        <Luggage className="h-12 w-12 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium mb-2">Aucune valise</h3>
        <p className="text-muted-foreground mb-4">
          Vous n'avez pas encore créé de valise. Créez-en une pour préparer votre prochain voyage !
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {suitcases.map((suitcase) => {
        // Déterminer le statut de la valise
        const today = new Date();
        const startDate = suitcase.start_date ? new Date(suitcase.start_date) : null;
        const endDate = suitcase.end_date ? new Date(suitcase.end_date) : null;
        
        let statusColor = "bg-gray-100 text-gray-700";
        let statusText = "En préparation";
        
        if (startDate && endDate) {
          if (today > endDate) {
            statusColor = "bg-blue-100 text-blue-700";
            statusText = "Voyage terminé";
          } else if (today >= startDate && today <= endDate) {
            statusColor = "bg-green-100 text-green-700";
            statusText = "Voyage en cours";
          } else if (startDate.getTime() - today.getTime() < 7 * 24 * 60 * 60 * 1000) {
            statusColor = "bg-amber-100 text-amber-700";
            statusText = "Départ proche";
          }
        }
        
        return (
          <Card key={suitcase.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold truncate">
                  {suitcase.name}
                </CardTitle>
                <Badge 
                  variant="outline" 
                  className={`${statusColor} border-none text-xs`}
                >
                  {statusText}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pb-2">
              {suitcase.description && (
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                  {suitcase.description}
                </p>
              )}
              
              <div className="space-y-2 text-sm">
                {(startDate && endDate) && (
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>
                      {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                      <span className="ml-1 text-xs opacity-75">
                        ({formatDistance(endDate, startDate, { locale: fr, addSuffix: false })})
                      </span>
                    </span>
                  </div>
                )}
                
                {suitcase.destination && (
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{suitcase.destination}</span>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="pt-2 flex justify-end gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2"
                onClick={() => onEdit(suitcase.id)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Modifier
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-destructive hover:text-destructive"
                onClick={() => onDelete(suitcase.id)}
              >
                <Trash className="h-4 w-4 mr-1" />
                Supprimer
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};
