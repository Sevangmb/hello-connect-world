
import { PageLayout } from "@/components/layouts/PageLayout";
import { Card } from "@/components/ui/card";

export default function Admin() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Administration</h1>
        <Card className="p-6">
          <p>Interface d'administration à venir</p>
        </Card>
      </div>
    </PageLayout>
  );
}
