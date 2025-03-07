
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Edit, Plus, Save, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { MenuItem } from "@/services/menu/types";
import { MenuUseCase } from "@/services/menu/application/MenuUseCase";
import { MenuRepository } from "@/services/menu/infrastructure/SupabaseMenuRepository";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminMenus() {
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedPath, setEditedPath] = useState("");

  // Create menu service instance
  const menuService = new MenuUseCase(new MenuRepository());

  const fetchMenuItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await menuService.getAllMenuItems();
      setMenuItems(items);
    } catch (e) {
      setError("Failed to load menu items.");
      console.error("Error fetching menu items:", e);
      toast({
        title: "Erreur",
        description: "Impossible de charger les éléments du menu",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  const refreshMenuItems = async () => {
    await fetchMenuItems();
  };

  const handleDelete = async (id: string) => {
    try {
      await menuService.deleteMenuItem(id);
      setMenuItems(menuItems.filter((item) => item.id !== id));
      toast({
        title: "Succès",
        description: "Élément du menu supprimé avec succès",
      });
    } catch (e) {
      console.error("Error deleting menu item:", e);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer cet élément du menu",
        variant: "destructive",
      });
    }
  };

  // Fix: Replace setMenuItemVisibility with updateMenuItem
  const toggleMenuItemVisibility = async (id: string) => {
    try {
      const item = menuItems.find(i => i.id === id);
      if (!item) return;
      
      // Use updateMenuItem instead of setMenuItemVisibility
      await menuService.updateMenuItem(id, { is_visible: !item.is_visible });
      await refreshMenuItems();
      
      toast({
        title: "Succès",
        description: "Visibilité mise à jour avec succès",
      });
    } catch (error) {
      console.error('Error toggling menu item visibility:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier la visibilité de cet élément du menu',
        variant: 'destructive',
      });
    }
  };

  // Use the existing updateMenuItem method
  const updateMenuItem = async (menuItemData: Partial<MenuItem> & { id: string }) => {
    try {
      const { id, ...updates } = menuItemData;
      await menuService.updateMenuItem(id, updates);
      await refreshMenuItems();
      
      toast({
        title: "Succès",
        description: "Élément du menu mis à jour avec succès",
      });
    } catch (error) {
      console.error("Error updating menu item:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour cet élément du menu",
        variant: "destructive",
      });
    }
  };

  const startEditing = (item: MenuItem) => {
    setEditingId(item.id);
    setEditedName(item.name);
    setEditedPath(item.path);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveChanges = async (id: string) => {
    await updateMenuItem({ id: id, name: editedName, path: editedPath });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Gestion des Menus</CardTitle>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un élément
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex flex-col gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/6" />
                  <Skeleton className="h-4 w-1/12" />
                </div>
              ))}
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
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
                  <TableRow key={item.id}>
                    <TableCell>
                      {editingId === item.id ? (
                        <Input
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                        />
                      ) : (
                        item.name
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === item.id ? (
                        <Input
                          value={editedPath}
                          onChange={(e) => setEditedPath(e.target.value)}
                        />
                      ) : (
                        item.path
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={item.is_active}
                        onCheckedChange={() => toggleMenuItemVisibility(item.id)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      {editingId === item.id ? (
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => saveChanges(item.id)}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={cancelEditing}>
                            Annuler
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditing(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
