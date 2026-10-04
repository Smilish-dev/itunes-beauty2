create table ib_services(id uuid primary key default gen_random_uuid(),name text not null,description text,price text,image_url text,sort int default 0,created_at timestamptz default now());
create table ib_products(id uuid primary key default gen_random_uuid(),name text not null,description text,price text,image_url text,sort int default 0,created_at timestamptz default now());
create table ib_gallery(id uuid primary key default gen_random_uuid(),image_url text not null,caption text,created_at timestamptz default now());
create table ib_settings(key text primary key,value text);

alter table ib_services enable row level security;
alter table ib_products enable row level security;
alter table ib_gallery enable row level security;
alter table ib_settings enable row level security;

create policy "ib read" on ib_services for select using(true);
create policy "ib write" on ib_services for all to authenticated using(true) with check(true);
create policy "ib read" on ib_products for select using(true);
create policy "ib write" on ib_products for all to authenticated using(true) with check(true);
create policy "ib read" on ib_gallery for select using(true);
create policy "ib write" on ib_gallery for all to authenticated using(true) with check(true);
create policy "ib read" on ib_settings for select using(true);
create policy "ib write" on ib_settings for all to authenticated using(true) with check(true);

insert into storage.buckets(id,name,public) values('ib-photos','ib-photos',true) on conflict do nothing;
create policy "ib photos read" on storage.objects for select using(bucket_id='ib-photos');
create policy "ib photos upload" on storage.objects for insert to authenticated with check(bucket_id='ib-photos');
create policy "ib photos delete" on storage.objects for delete to authenticated using(bucket_id='ib-photos');
