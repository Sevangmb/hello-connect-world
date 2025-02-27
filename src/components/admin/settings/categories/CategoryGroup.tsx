
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Category } from "./useCategoryForm";

interface CategoryGroupProps {
  type: string;
  categories: Category[];
  isLoading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onToggleActive: (category: Category) => void;
}

export function CategoryGroup({ 
  type, 
  categories, 
  isLoading, 
  onEdit, 
  onDelete, 
  onToggleActive 
}: CategoryGroupProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h4 className="text-base font-medium">{type}</h4>
        <Badge variant="outline" className="font-normal">
          {categories.length} {categories.length > 1 ? 'catégories' : 'catégorie'}
        </Badge>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Icône</TableHead>
            <TableHead>Ordre</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell className="max-w-xs truncate">{category.description}</TableCell>
              <TableCell>{category.icon}</TableCell>
              <TableCell>{category.order_index}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={category.is_active} 
                    onCheckedChange={() => onToggleActive(category)}
                    disabled={isLoading}
                  />
                  <div className="flex items-center gap-1.5">
                    {category.is_active ? (
                      <>
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>Actif</span>
                      </>
                    ) : (
                      <>
                        <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                        <span className="text-muted-foreground">Inactif</span>
                      </>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(category)}
                    disabled={isLoading}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Modifier</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(category.id)}
                    disabled={isLoading}
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Supprimer</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
