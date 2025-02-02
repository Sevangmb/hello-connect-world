import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Check, Trash2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminShops() {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Boutiques</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Cette page permet aux administrateurs de visualiser et gérer les boutiques, d&apos;approuver ou rejeter les demandes, et d&apos;inspecter les détails de chaque boutique.</p>
          <Table>
        </CardContent>
      </Card>
    </div>
  );
}