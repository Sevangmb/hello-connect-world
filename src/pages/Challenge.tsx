
import { useParams } from "react-router-dom";
import { PageLayout } from "@/components/layouts/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Challenge() {
  const { id } = useParams();

  return (
    <PageLayout>
      <Card>
        <CardHeader>
          <CardTitle>Challenge #{id}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Détails du challenge</p>
        </CardContent>
      </Card>
    </PageLayout>
  );
}
