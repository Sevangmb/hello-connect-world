
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getMenuUseCase } from "@/services/menu/infrastructure/menuServiceProvider";
import { MenuItem, MenuItemCategory } from "@/services/menu/types";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Plus, Trash2 } from "lucide-react";

export default function AdminMenus() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<MenuItemCategory>('main');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMenuItem, setCurrentMenuItem] = useState<Partial<MenuItem> | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadMenuItems = async () => {
      try {
        setLoading(true);
        const menuUseCase = getMenuUseCase();
        const items = await menuUseCase.getAllMenuItems();
        setMenuItems(items);
      } catch (error) {
        console.error("Erreur lors du chargement des éléments de menu:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les éléments de menu",
        });
      } finally {
        setLoading(false);
      }
    };

    loadMenuItems();
  }, [toast]);

  const filteredMenuItems = menuItems.filter(
    (item) => item.category === selectedCategory
  );

  const openDialog = (item?: MenuItem) => {
    if (item) {
      setCurrentMenuItem(item);
      setIsEditMode(true);
    } else {
      setCurrentMenuItem({
        name: "",
        path: "",
        icon: "",
        module_code: null,
        category: selectedCategory,
        position: filteredMenuItems.length,
        parent_id: null,
        description: "",
        is_active: true,
        is_visible: true,
        requires_admin: false,
      });
      setIsEditMode(false);
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setCurrentMenuItem(null);
  };

  const handleUpdateStatus = async (id: string, field: keyof MenuItem, value: boolean) => {
    try {
      const menuUseCase = getMenuUseCase();
      await menuUseCase.updateMenuItem({ id, [field]: value });
      
      setMenuItems(menuItems.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      ));
      
      toast({
        title: "Succès",
        description: "Élément de menu mis à jour avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'élément de menu:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour l'élément de menu",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentMenuItem) return;
    
    try {
      const menuUseCase = getMenuUseCase();
      if (isEditMode && currentMenuItem.id) {
        const updatedItem = await menuUseCase.updateMenuItem(currentMenuItem as (Partial<MenuItem> & { id: string }));
        setMenuItems(menuItems.map(item => 
          item.id === updatedItem?.id ? updatedItem : item
        ));
        
        toast({
          title: "Succès",
          description: "Élément de menu mis à jour avec succès",
        });
      } else {
        const newItem = await menuUseCase.createMenuItem(currentMenuItem as Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>);
        if (newItem) {
          setMenuItems([...menuItems, newItem]);
          
          toast({
            title: "Succès",
            description: "Élément de menu créé avec succès",
          });
        }
      }
      
      closeDialog();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'élément de menu:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder l'élément de menu",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet élément de menu ?")) {
      return;
    }
    
    try {
      const menuUseCase = getMenuUseCase();
      await menuUseCase.deleteMenuItem(id);
      
      setMenuItems(menuItems.filter(item => item.id !== id));
      
      toast({
        title: "Succès",
        description: "Élément de menu supprimé avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'élément de menu:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer l'élément de menu",
      });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (currentMenuItem) {
      setCurrentMenuItem({
        ...currentMenuItem,
        [field]: value,
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gestion des Menus</CardTitle>
            <CardDescription>
              Gérez les éléments de menu de l'application
            </CardDescription>
          </div>
          <Button onClick={() => openDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un élément
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="main"
            onValueChange={(value) => setSelectedCategory(value as MenuItemCategory)}
          >
            <TabsList className="mb-4 grid grid-cols-6 gap-2">
              <TabsTrigger value="main">Principales</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
              <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
              <TabsTrigger value="utility">Utilitaires</TabsTrigger>
              <TabsTrigger value="system">Système</TabsTrigger>
            </TabsList>

            {Object.values(['main', 'admin', 'social', 'marketplace', 'utility', 'system']).map((category) => (
              <TabsContent key={category} value={category}>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Chemin</TableHead>
                        <TableHead>Module</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Actif</TableHead>
                        <TableHead>Visible</TableHead>
                        <TableHead>Admin</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-4">
                            Chargement des éléments de menu...
                          </TableCell>
                        </TableRow>
                      ) : filteredMenuItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-4">
                            Aucun élément de menu dans cette catégorie
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredMenuItems
                          .sort((a, b) => a.position - b.position)
                          .map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell>{item.path}</TableCell>
                              <TableCell>
                                {item.module_code ? (
                                  <Badge variant="outline">{item.module_code}</Badge>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </TableCell>
                              <TableCell>{item.position}</TableCell>
                              <TableCell>
                                <Switch
                                  checked={item.is_active}
                                  onCheckedChange={(checked) =>
                                    handleUpdateStatus(item.id, "is_active", checked)
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <Switch
                                  checked={item.is_visible}
                                  onCheckedChange={(checked) =>
                                    handleUpdateStatus(item.id, "is_visible", checked)
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <Switch
                                  checked={item.requires_admin}
                                  onCheckedChange={(checked) =>
                                    handleUpdateStatus(item.id, "requires_admin", checked)
                                  }
                                />
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openDialog(item)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(item.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[475px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Modifier un élément de menu" : "Ajouter un élément de menu"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Modifiez les détails de l'élément de menu"
                : "Complétez le formulaire pour créer un nouvel élément de menu"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nom
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  value={currentMenuItem?.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="path" className="text-right">
                  Chemin
                </Label>
                <Input
                  id="path"
                  className="col-span-3"
                  value={currentMenuItem?.path || ""}
                  onChange={(e) => handleInputChange("path", e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="icon" className="text-right">
                  Icône
                </Label>
                <Input
                  id="icon"
                  className="col-span-3"
                  value={currentMenuItem?.icon || ""}
                  onChange={(e) => handleInputChange("icon", e.target.value)}
                  placeholder="Nom de l'icône Lucide (ex: Home)"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="module_code" className="text-right">
                  Module
                </Label>
                <Input
                  id="module_code"
                  className="col-span-3"
                  value={currentMenuItem?.module_code || ""}
                  onChange={(e) => handleInputChange("module_code", e.target.value || null)}
                  placeholder="Code du module (optionnel)"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Catégorie
                </Label>
                <Select
                  value={currentMenuItem?.category || "main"}
                  onValueChange={(value) => handleInputChange("category", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Principales</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="marketplace">Marketplace</SelectItem>
                    <SelectItem value="utility">Utilitaires</SelectItem>
                    <SelectItem value="system">Système</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="position" className="text-right">
                  Position
                </Label>
                <Input
                  id="position"
                  type="number"
                  className="col-span-3"
                  value={currentMenuItem?.position || 0}
                  onChange={(e) => handleInputChange("position", parseInt(e.target.value))}
                  min="0"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  className="col-span-3"
                  value={currentMenuItem?.description || ""}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Description (optionnel)"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right">Options</div>
                <div className="col-span-3 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={currentMenuItem?.is_active ?? true}
                      onCheckedChange={(checked) => handleInputChange("is_active", checked)}
                    />
                    <Label htmlFor="is_active">Actif</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_visible"
                      checked={currentMenuItem?.is_visible ?? true}
                      onCheckedChange={(checked) => handleInputChange("is_visible", checked)}
                    />
                    <Label htmlFor="is_visible">Visible</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requires_admin"
                      checked={currentMenuItem?.requires_admin ?? false}
                      onCheckedChange={(checked) => handleInputChange("requires_admin", checked)}
                    />
                    <Label htmlFor="requires_admin">Administration uniquement</Label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Annuler
              </Button>
              <Button type="submit">
                {isEditMode ? "Mettre à jour" : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
