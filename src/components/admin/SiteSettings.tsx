
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { AdminCheck } from "./settings/AdminCheck";
import { SettingsTabs } from "./settings/SettingsTabs";
import { useSettings } from "./settings/useSettings";

export function SiteSettings() {
  const { settings, categories, isLoading, handleSave } = useSettings();

  if (isLoading && (!settings || !categories)) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AdminCheck>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Paramètres du site</CardTitle>
          </CardHeader>
          <CardContent>
            <SettingsTabs 
              settings={settings}
              categories={categories}
              isLoading={isLoading}
              onSave={handleSave}
            />
          </CardContent>
        </Card>
      </div>
    </AdminCheck>
  );
}
