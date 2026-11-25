-- OBS Mobil: veritabanı tabloları ve güvenlik kuralları
-- Supabase panelinde: SQL Editor → New query → bu dosyanın tamamını yapıştır → Run

-- Öğrencinin kimlik bilgileri. id, Supabase'deki giriş hesabıyla (auth.users) aynıdır.
create table public.ogrenciler (
  id uuid primary key references auth.users (id) on delete cascade,
  ad text not null,
  ogrenci_no text not null unique,
  bolum text not null,
  sinif int not null default 1,
  eposta text,
  danisman text,
  genel_ortalama numeric(3, 2),
  akts int not null default 0,
  toplam_akts int not null default 240,
  devamsizlik_saat int not null default 0
);

-- Dönemler (herkes için ortak)
create table public.donemler (
  id int primary key,
  ad text not null,
  sira int not null -- 1 = en yeni dönem
);

-- Her öğrencinin her dersteki notları
create table public.notlar (
  id bigint generated always as identity primary key,
  ogrenci_id uuid not null references public.ogrenciler (id) on delete cascade,
  donem_id int not null references public.donemler (id),
  ders text not null,
  vize int check (vize between 0 and 100),
  final int check (final between 0 and 100),
  akts int not null,
  harf text -- final girilmediyse boş
);

-- Haftalık ders programı (gun: 1 = Pazartesi … 5 = Cuma)
create table public.ders_programi (
  id bigint generated always as identity primary key,
  ogrenci_id uuid not null references public.ogrenciler (id) on delete cascade,
  gun int not null check (gun between 1 and 7),
  baslangic time not null,
  bitis time not null,
  ders text not null,
  sinif text,
  hoca text
);

-- Duyurular (giriş yapan herkes görür)
create table public.duyurular (
  id bigint generated always as identity primary key,
  baslik text not null,
  kimden text not null,
  tarih date not null default current_date,
  yeni boolean not null default false
);

-- ---------------------------------------------------------------
-- Güvenlik (Row Level Security): her öğrenci SADECE kendi verisini görür.
-- Uygulama veriyi yalnızca okur; ekleme/silme panelden yapılır.
-- ---------------------------------------------------------------
alter table public.ogrenciler enable row level security;
alter table public.donemler enable row level security;
alter table public.notlar enable row level security;
alter table public.ders_programi enable row level security;
alter table public.duyurular enable row level security;

create policy "Öğrenci kendi bilgisini görür" on public.ogrenciler
  for select to authenticated using ((select auth.uid()) = id);

create policy "Öğrenci kendi notlarını görür" on public.notlar
  for select to authenticated using ((select auth.uid()) = ogrenci_id);

create policy "Öğrenci kendi programını görür" on public.ders_programi
  for select to authenticated using ((select auth.uid()) = ogrenci_id);

create policy "Giriş yapan herkes dönemleri görür" on public.donemler
  for select to authenticated using (true);

create policy "Giriş yapan herkes duyuruları görür" on public.duyurular
  for select to authenticated using (true);

create index on public.notlar (ogrenci_id);
create index on public.ders_programi (ogrenci_id);
