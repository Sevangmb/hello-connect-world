
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Category {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: string;
  order_index: number;
  is_active: boolean;
}

interface CategoriesSettingsProps {
  categories: Category[] | undefined;
  isLoading: boolean;
}

export function CategoriesSettings({ categories, isLoading }: CategoriesSettingsProps) {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Icône</TableHead>
            <TableHead>Ordre</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories?.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.type}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.description}</TableCell>
              <TableCell>{category.icon}</TableCell>
              <TableCell>{category.order_index}</TableCell>
              <TableCell>
                {category.is_active ? "Actif" : "Inactif"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button variant="outline" disabled={isLoading}>Ajouter une catégorie</Button>
    </div>
  );
}
