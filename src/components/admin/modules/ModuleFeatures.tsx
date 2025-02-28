
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Info, AlertCircle, Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useModules } from "@/hooks/useModules";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Définition du type pour les feature flags
interface FeatureFlag {
  id: string;
  module_code: string;
  feature_code: string;
  feature_name: string;
  description: string | null;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export const ModuleFeatures = () => {
  const { modules, loading, isModuleActive, updateFeatureStatus } = useModules();
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
  const [isLoadingFeatures, setIsLoadingFeatures] = useState(true);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [newFeature, setNewFeature] = useState({
    module_code: "",
    feature_code: "",
    feature_name: "",
    description: "",
    is_enabled: true
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // Récupérer les feature flags
  const fetchFeatureFlags = async () => {
    try {
      setIsLoadingFeatures(true);
      const { data, error } = await supabase
        .from('module_features')
        .select('*')
        .order('module_code, feature_code');

      if (error) throw error;
      setFeatureFlags(data || []);
    } catch (error: any) {
      console.error("Erreur lors de la récupération des feature flags:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les fonctionnalités des modules",
      });
    } finally {
      setIsLoadingFeatures(false);
    }
  };

  // Ajouter un nouveau feature flag
  const handleAddFeature = async () => {
    try {
      if (!newFeature.module_code || !newFeature.feature_code || !newFeature.feature_name) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Veuillez remplir tous les champs obligatoires",
        });
        return;
      }

      const { error } = await supabase
        .from('module_features')
        .insert({
          module_code: newFeature.module_code,
          feature_code: newFeature.feature_code,
          feature_name: newFeature.feature_name,
          description: newFeature.description || null,
          is_enabled: newFeature.is_enabled
        });

      if (error) throw error;

      toast({
        title: "Fonctionnalité ajoutée",
        description: "La nouvelle fonctionnalité a été ajoutée avec succès",
      });

      // Réinitialiser le formulaire et fermer la boîte de dialogue
      setNewFeature({
        module_code: "",
        feature_code: "",
        feature_name: "",
        description: "",
        is_enabled: true
      });
      setIsDialogOpen(false);

      // Rafraîchir la liste des feature flags
      fetchFeatureFlags();
    } catch (error: any) {
      console.error("Erreur lors de l'ajout de la fonctionnalité:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter la nouvelle fonctionnalité",
      });
    }
  };

  // Mettre à jour l'état d'un feature flag
  const handleToggleFeature = async (moduleCode: string, featureCode: string, isEnabled: boolean) => {
    await updateFeatureStatus(moduleCode, featureCode, isEnabled);
    fetchFeatureFlags();
  };

  // Charger les données au montage du composant
  useEffect(() => {
    fetchFeatureFlags();
  }, []);

  // Filtrer les feature flags par module
  const filteredFeatureFlags = selectedModule
    ? featureFlags.filter(f => f.module_code === selectedModule)
    : featureFlags;

  if (loading || isLoadingFeatures) {
    return <div className="flex justify-center p-8">Chargement des fonctionnalités...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Gestion des Fonctionnalités</CardTitle>
        <div className="flex items-center gap-4">
          <div>
            <select
              className="border border-gray-300 rounded px-3 py-2"
              value={selectedModule || ""}
              onChange={(e) => setSelectedModule(e.target.value || null)}
            >
              <option value="">Tous les modules</option>
              {modules.map((module) => (
                <option key={module.id} value={module.code}>
                  {module.name}
                </option>
              ))}
            </select>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Ajouter une fonctionnalité
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter une nouvelle fonctionnalité</DialogTitle>
                <DialogDescription>
                  Remplissez les informations ci-dessous pour ajouter une nouvelle fonctionnalité à un module.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="module" className="text-right">
                    Module *
                  </Label>
                  <div className="col-span-3">
                    <select
                      id="module"
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      value={newFeature.module_code}
                      onChange={(e) => setNewFeature({ ...newFeature, module_code: e.target.value })}
                      required
                    >
                      <option value="">Sélectionnez un module</option>
                      {modules.map((module) => (
                        <option key={module.id} value={module.code}>
                          {module.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="feature_code" className="text-right">
                    Code *
                  </Label>
                  <Input
                    id="feature_code"
                    value={newFeature.feature_code}
                    onChange={(e) => setNewFeature({ ...newFeature, feature_code: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="feature_name" className="text-right">
                    Nom *
                  </Label>
                  <Input
                    id="feature_name"
                    value={newFeature.feature_name}
                    onChange={(e) => setNewFeature({ ...newFeature, feature_name: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right pt-2">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newFeature.description}
                    onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="is_enabled" className="text-right">
                    Activée
                  </Label>
                  <div className="col-span-3 flex items-center">
                    <Switch
                      id="is_enabled"
                      checked={newFeature.is_enabled}
                      onCheckedChange={(checked) => setNewFeature({ ...newFeature, is_enabled: checked })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddFeature}>Ajouter</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Module</TableHead>
              <TableHead>Fonctionnalité</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>État</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFeatureFlags.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  Aucune fonctionnalité trouvée
                </TableCell>
              </TableRow>
            ) : (
              filteredFeatureFlags.map((feature) => {
                const moduleIsActive = isModuleActive(feature.module_code);
                const module = modules.find(m => m.code === feature.module_code);
                
                return (
                  <TableRow key={feature.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {module?.name || feature.module_code}
                        <Badge variant={moduleIsActive ? "default" : "destructive"} className="text-xs">
                          {moduleIsActive ? "Actif" : "Inactif"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{feature.feature_name} <span className="text-xs text-gray-500">({feature.feature_code})</span></TableCell>
                    <TableCell>{feature.description || "-"}</TableCell>
                    <TableCell>
                      {feature.is_enabled ? (
                        <Badge className="bg-green-500">Activée</Badge>
                      ) : (
                        <Badge variant="outline">Désactivée</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={feature.is_enabled}
                          onCheckedChange={(checked) => handleToggleFeature(feature.module_code, feature.feature_code, checked)}
                          disabled={!moduleIsActive}
                        />
                        {!moduleIsActive && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertCircle className="h-4 w-4 text-yellow-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Le module parent est inactif</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ModuleFeatures;
