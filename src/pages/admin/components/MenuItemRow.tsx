
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Edit, Save, Trash2 } from "lucide-react";
import { MenuItem } from "@/services/menu/types";

interface MenuItemRowProps {
  item: MenuItem;
  isEditing: boolean;
  editedName: string;
  editedPath: string;
  onEditStart: () => void;
  onEditCancel: () => void;
  onSaveChanges: () => void;
  onDelete: () => void;
  onToggleVisibility: () => void;
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
  return (
    <TableRow>
      <TableCell>
        {isEditing ? (
          <Input
            value={editedName}
            onChange={(e) => onNameChange(e.target.value)}
          />
        ) : (
          item.name
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input
            value={editedPath}
            onChange={(e) => onPathChange(e.target.value)}
          />
        ) : (
          item.path
        )}
      </TableCell>
      <TableCell>
        <Switch
          checked={item.is_active}
          onCheckedChange={onToggleVisibility}
        />
      </TableCell>
      <TableCell className="text-right">
        {isEditing ? (
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSaveChanges}
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onEditCancel}>
              Annuler
            </Button>
          </div>
        ) : (
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEditStart}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};
