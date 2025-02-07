
insert into storage.buckets (id, name, public)
values ('virtual-tryon', 'virtual-tryon', true);

create policy "Virtual try-on images are publicly accessible"
on storage.objects for select
using ( bucket_id = 'virtual-tryon' );

create policy "Authenticated users can upload virtual try-on images"
on storage.objects for insert
with check (
  bucket_id = 'virtual-tryon'
  and auth.role() = 'authenticated'
);

create policy "Users can update their own virtual try-on images"
on storage.objects for update
using (
  bucket_id = 'virtual-tryon'
  and auth.uid() = owner
);

create policy "Users can delete their own virtual try-on images"
on storage.objects for delete
using (
  bucket_id = 'virtual-tryon'
  and auth.uid() = owner
);
