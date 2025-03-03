
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useMenu } from "@/hooks/useMenu";
import { Plus, Trash, Edit, MoveVertical, Save } from "lucide-react";
import { MenuItem } from "@/services/modules/menu/types";
import { useModuleRegistry } from "@/hooks/modules/useModuleRegistry";
import { MENU_MODULE_CODE } from "@/hooks/modules/constants";

export default function AdminMenus() {
  const { menuConfig, loading, error, addMenuItem, updateMenuItem, deleteMenuItem, reorderMenuItems } = useMenu();
  const { isModuleActive } = useModuleRegistry();
  const { toast } = useToast();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    path: '',
    moduleCode: 'core',
    position: 0,
    isVisible: true,
    requiresAuth: false
  });
  
  // Vérifier si le module menu est actif
  const [menuModuleActive, setMenuModuleActive] = useState(false);
  React.useEffect(() => {
    const checkMenuModule = async () => {
      const active = await isModuleActive(MENU_MODULE_CODE);
      setMenuModuleActive(active);
    };
    checkMenuModule();
  }, [isModuleActive]);
  
  // Gérer la soumission du formulaire d'ajout
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!formData.name || !formData.path) {
        toast({
          title: "Erreur",
          description: "Veuillez remplir tous les champs obligatoires",
          variant: "destructive"
        });
        return;
      }
      
      const newItem = await addMenuItem({
        name: formData.name!,
        path: formData.path!,
        moduleCode: formData.moduleCode || 'core',
        position: formData.position || 0,
        isVisible: formData.isVisible || true,
        requiresAuth: formData.requiresAuth || false
      });
      
      if (newItem) {
        toast({
          title: "Succès",
          description: `L'élément de menu "${formData.name}" a été ajouté`,
          variant: "default"
        });
        setIsAddDialogOpen(false);
        setFormData({
          name: '',
          path: '',
          moduleCode: 'core',
          position: 0,
          isVisible: true,
          requiresAuth: false
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter l'élément de menu",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error("Erreur lors de l'ajout d'un élément de menu:", err);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };
  
  // Gérer la soumission du formulaire d'édition
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentItem) return;
    
    try {
      if (!formData.name || !formData.path) {
        toast({
          title: "Erreur",
          description: "Veuillez remplir tous les champs obligatoires",
          variant: "destructive"
        });
        return;
      }
      
      const success = await updateMenuItem(currentItem.id, {
        name: formData.name,
        path: formData.path,
        moduleCode: formData.moduleCode,
        position: formData.position,
        isVisible: formData.isVisible,
        requiresAuth: formData.requiresAuth
      });
      
      if (success) {
        toast({
          title: "Succès",
          description: `L'élément de menu "${formData.name}" a été mis à jour`,
          variant: "default"
        });
        setIsEditDialogOpen(false);
        setCurrentItem(null);
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour l'élément de menu",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error("Erreur lors de la mise à jour d'un élément de menu:", err);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive"
      });
    }
  };
  
  // Ouvrir le dialogue d'édition
  const openEditDialog = (item: MenuItem) => {
    setCurrentItem(item);
    setFormData({
      name: item.name,
      path: item.path,
      moduleCode: item.moduleCode,
      position: item.position,
      isVisible: item.isVisible,
      requiresAuth: item.requiresAuth
    });
    setIsEditDialogOpen(true);
  };
  
  // Supprimer un élément de menu
  const handleDelete = async (item: MenuItem) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'élément de menu "${item.name}" ?`)) {
      try {
        const success = await deleteMenuItem(item.id);
        
        if (success) {
          toast({
            title: "Succès",
            description: `L'élément de menu "${item.name}" a été supprimé`,
            variant: "default"
          });
        } else {
          toast({
            title: "Erreur",
            description: "Impossible de supprimer l'élément de menu",
            variant: "destructive"
          });
        }
      } catch (err) {
        console.error("Erreur lors de la suppression d'un élément de menu:", err);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue",
          variant: "destructive"
        });
      }
    }
  };
  
  // Gérer le changement des champs du formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Rendu en cas de chargement
  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Gestion des menus</CardTitle>
            <CardDescription>Chargement...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-20 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Gestion des Menus</CardTitle>
            <CardDescription>
              Configurez les menus de l'application
            </CardDescription>
          </div>
          
          <div className="mt-2 sm:mt-0">
            <Button 
              onClick={() => setIsAddDialogOpen(true)} 
              className="flex items-center"
              disabled={!menuModuleActive}
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un élément
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {!menuModuleActive && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4">
              <p className="font-medium">Le module Menu n'est pas actif</p>
              <p className="text-sm">Veuillez activer le module Menu dans la gestion des modules pour pouvoir gérer les menus.</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
              <p className="font-medium">Erreur</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          {menuConfig.sections.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded">
              <p className="text-gray-500">Aucun élément de menu n'a été configuré</p>
              <Button 
                onClick={() => setIsAddDialogOpen(true)} 
                variant="outline" 
                className="mt-4"
                disabled={!menuModuleActive}
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter votre premier élément
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Chemin</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Visible</TableHead>
                    <TableHead>Auth. requise</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menuConfig.sections.flatMap(section => section.items).map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.path}</TableCell>
                      <TableCell>{item.moduleCode}</TableCell>
                      <TableCell>
                        <Switch checked={item.isVisible} disabled />
                      </TableCell>
                      <TableCell>
                        <Switch checked={item.requiresAuth} disabled />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => openEditDialog(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="text-red-500"
                            onClick={() => handleDelete(item)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogue d'ajout */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter un élément de menu</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nom
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="path" className="text-right">
                  Chemin
                </Label>
                <Input
                  id="path"
                  name="path"
                  value={formData.path}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="moduleCode" className="text-right">
                  Module
                </Label>
                <Input
                  id="moduleCode"
                  name="moduleCode"
                  value={formData.moduleCode}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isVisible" className="text-right">
                  Visible
                </Label>
                <div className="col-span-3 flex items-center">
                  <Switch
                    id="isVisible"
                    name="isVisible"
                    checked={formData.isVisible}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, isVisible: checked }))
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="requiresAuth" className="text-right">
                  Auth. requise
                </Label>
                <div className="col-span-3 flex items-center">
                  <Switch
                    id="requiresAuth"
                    name="requiresAuth"
                    checked={formData.requiresAuth}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, requiresAuth: checked }))
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Ajouter</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialogue d'édition */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier un élément de menu</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Nom
                </Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-path" className="text-right">
                  Chemin
                </Label>
                <Input
                  id="edit-path"
                  name="path"
                  value={formData.path}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-moduleCode" className="text-right">
                  Module
                </Label>
                <Input
                  id="edit-moduleCode"
                  name="moduleCode"
                  value={formData.moduleCode}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-isVisible" className="text-right">
                  Visible
                </Label>
                <div className="col-span-3 flex items-center">
                  <Switch
                    id="edit-isVisible"
                    name="isVisible"
                    checked={formData.isVisible}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, isVisible: checked }))
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-requiresAuth" className="text-right">
                  Auth. requise
                </Label>
                <div className="col-span-3 flex items-center">
                  <Switch
                    id="edit-requiresAuth"
                    name="requiresAuth"
                    checked={formData.requiresAuth}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, requiresAuth: checked }))
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Enregistrer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
