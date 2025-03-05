
-- Créer un bucket pour stocker les factures
insert into storage.buckets (id, name, public)
values ('invoices', 'invoices', false);

-- Politique permettant aux utilisateurs authentifiés de télécharger leurs propres factures
create policy "Les utilisateurs peuvent télécharger leurs factures"
on storage.objects for select
using (
  bucket_id = 'invoices' 
  and (
    auth.uid() = (
      select buyer_id from public.invoices 
      where invoice_number = regexp_replace(name, 'invoice_|\.pdf', '', 'g')
    )
    or
    auth.uid() = (
      select seller_id from public.invoices 
      where invoice_number = regexp_replace(name, 'invoice_|\.pdf', '', 'g')
    )
    or
    auth.role() = 'service_role'
  )
);

-- Politique permettant au service role d'insérer des factures
create policy "Le service role peut insérer des factures"
on storage.objects for insert
with check (
  bucket_id = 'invoices' 
  and auth.role() = 'service_role'
);
