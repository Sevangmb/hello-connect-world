import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminMarketing() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Marketing</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Interface de gestion des campagnes marketing</p>
        </CardContent>
      </Card>
    </div>
  );
}
