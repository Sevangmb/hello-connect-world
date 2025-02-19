
import { PageLayout } from "@/components/layouts/PageLayout";
import { PublishForm } from "@/components/publications/PublishForm";
import { Card } from "@/components/ui/card";

const Personal = () => {
  return (
    <PageLayout>
      <h1 className="text-2xl font-bold mb-6">Mon Espace Personnel</h1>
      <Card className="p-6 mb-8">
        <PublishForm />
      </Card>
    </PageLayout>
  );
};

export default Personal;
