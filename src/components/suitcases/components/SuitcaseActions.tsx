
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, Trash, MoreVertical, Archive, Eye } from "lucide-react";

interface SuitcaseActionsProps {
  suitcaseId: string;
}

export const SuitcaseActions: React.FC<SuitcaseActionsProps> = ({ suitcaseId }) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Edit suitcase', suitcaseId);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Delete suitcase', suitcaseId);
  };

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Archive suitcase', suitcaseId);
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('View suitcase', suitcaseId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleView}>
          <Eye className="mr-2 h-4 w-4" />
          Voir
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Modifier
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleArchive}>
          <Archive className="mr-2 h-4 w-4" />
          Archiver
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleDelete}
          className="text-destructive"
        >
          <Trash className="mr-2 h-4 w-4" />
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
