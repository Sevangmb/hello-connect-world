import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminHelp() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Aide & Support</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Centre d'aide et documentation</p>
        </CardContent>
      </Card>
    </div>
  );
}