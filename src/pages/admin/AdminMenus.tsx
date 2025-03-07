
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useMenuItems } from "./hooks/useMenuItems";
import { MenuHeader } from "./components/MenuHeader";
import { MenuItemsTable } from "./components/MenuItemsTable";

export default function AdminMenus() {
  const {
    menuItems,
    loading,
    error,
    editingId,
    editedName,
    editedPath,
    fetchMenuItems,
    handleDelete,
    toggleMenuItemVisibility,
    startEditing,
    cancelEditing,
    saveChanges,
    setEditedName,
    setEditedPath,
  } = useMenuItems();

  // Fetch menu items on component mount
  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  // Handler for add item button (to be implemented)
  const handleAddItem = () => {
    // This functionality would be added in a future implementation
    console.log("Add item functionality to be implemented");
  };

  return (
    <div className="space-y-6">
      <Card>
        <MenuHeader onAddItem={handleAddItem} />
        <CardContent>
          <MenuItemsTable
            menuItems={menuItems}
            loading={loading}
            error={error}
            editingId={editingId}
            editedName={editedName}
            editedPath={editedPath}
            onEditStart={startEditing}
            onEditCancel={cancelEditing}
            onSaveChanges={saveChanges}
            onDelete={handleDelete}
            onToggleVisibility={toggleMenuItemVisibility}
            onNameChange={setEditedName}
            onPathChange={setEditedPath}
          />
        </CardContent>
      </Card>
    </div>
  );
}
