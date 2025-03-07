
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MenuItemCategory } from "@/services/menu/types";
import { CreateMenuItemParams } from "@/services/menu/types";

interface MenuItemFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (item: CreateMenuItemParams) => Promise<void>;
}

export const MenuItemForm: React.FC<MenuItemFormProps> = ({ open, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [path, setPath] = useState("");
  const [category, setCategory] = useState<MenuItemCategory>("main");
  const [isVisible, setIsVisible] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !path.trim()) {
      setError("Name and Path are required fields");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    
    try {
      await onSave({
        name, 
        path, 
        category,
        is_visible: isVisible,
        is_active: true,
        position: 0
      });
      
      // Reset form
      setName("");
      setPath("");
      setCategory("main");
      setIsVisible(true);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories: { value: MenuItemCategory; label: string }[] = [
    { value: "main", label: "Main" },
    { value: "admin", label: "Admin" },
    { value: "user", label: "User" },
    { value: "shop", label: "Shop" },
    { value: "profile", label: "Profile" },
    { value: "settings", label: "Settings" },
    { value: "legal", label: "Legal" },
    { value: "system", label: "System" },
    { value: "marketplace", label: "Marketplace" },
    { value: "social", label: "Social" },
    { value: "utility", label: "Utility" }
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Menu Item</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {error && (
            <div className="text-red-500 bg-red-50 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Menu Item Name"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="path">Path</Label>
              <Input
                id="path"
                value={path}
                onChange={(e) => setPath(e.target.value)}
                placeholder="/example/path"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={category} 
                onValueChange={(value) => setCategory(value as MenuItemCategory)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="visibility">Visible</Label>
              <Switch 
                id="visibility" 
                checked={isVisible}
                onCheckedChange={setIsVisible}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
