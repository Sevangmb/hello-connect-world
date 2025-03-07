
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { MenuItem } from "@/services/menu/types";
import { MenuItemRow } from "./MenuItemRow";

interface MenuItemsTableProps {
  menuItems: MenuItem[];
  loading: boolean;
  error: string | null;
  editingId: string | null;
  editedName: string;
  editedPath: string;
  onEditStart: (item: MenuItem) => void;
  onEditCancel: () => void;
  onSaveChanges: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onNameChange: (value: string) => void;
  onPathChange: (value: string) => void;
}

export const MenuItemsTable: React.FC<MenuItemsTableProps> = ({
  menuItems,
  loading,
  error,
  editingId,
  editedName,
  editedPath,
  onEditStart,
  onEditCancel,
  onSaveChanges,
  onDelete,
  onToggleVisibility,
  onNameChange,
  onPathChange,
}) => {
  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/6" />
            <Skeleton className="h-4 w-1/12" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Chemin</TableHead>
          <TableHead>Visible</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {menuItems.map((item) => (
          <MenuItemRow
            key={item.id}
            item={item}
            isEditing={editingId === item.id}
            editedName={editedName}
            editedPath={editedPath}
            onEditStart={() => onEditStart(item)}
            onEditCancel={onEditCancel}
            onSaveChanges={() => onSaveChanges(item.id)}
            onDelete={() => onDelete(item.id)}
            onToggleVisibility={() => onToggleVisibility(item.id)}
            onNameChange={onNameChange}
            onPathChange={onPathChange}
          />
        ))}
      </TableBody>
    </Table>
  );
};
