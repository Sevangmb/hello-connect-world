
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MenuItem } from "@/services/menu/types";
import { Check, X, Edit, Trash, Eye, EyeOff } from "lucide-react";

interface MenuItemRowProps {
  item: MenuItem;
  isEditing: boolean;
  editedName: string;
  editedPath: string;
  onEditStart: () => void;
  onEditCancel: () => void;
  onSaveChanges: () => void;
  onDelete: () => void;
  onToggleVisibility: () => void; // No need to change this signature
  onNameChange: (value: string) => void;
  onPathChange: (value: string) => void;
}

export const MenuItemRow: React.FC<MenuItemRowProps> = ({
  item,
  isEditing,
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
  if (isEditing) {
    return (
      <TableRow>
        <TableCell>
          <Input
            value={editedName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Nom de l'élément"
          />
        </TableCell>
        <TableCell>
          <Input
            value={editedPath}
            onChange={(e) => onPathChange(e.target.value)}
            placeholder="Chemin"
          />
        </TableCell>
        <TableCell>
          {item.is_visible ? (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
              Visible
            </span>
          ) : (
            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
              Caché
            </span>
          )}
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" size="icon" onClick={onSaveChanges}>
              <Check className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onEditCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell>{item.name}</TableCell>
      <TableCell>{item.path}</TableCell>
      <TableCell>
        {item.is_visible ? (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
            Visible
          </span>
        ) : (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
            Caché
          </span>
        )}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" size="icon" onClick={onEditStart}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onToggleVisibility}>
            {item.is_visible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
