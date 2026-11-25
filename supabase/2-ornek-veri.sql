-- OBS Mobil: örnek öğrenci verisi
-- ÖNCE Authentication → Users → Add user → Create new user ile şu kullanıcıyı oluştur:
--   E-posta: 2024104512@ogrenci.example.com
--   Şifre:   (kendin belirle)
--   "Auto Confirm User" kutusu İŞARETLİ olsun
-- Sonra SQL Editor'da bu dosyanın tamamını çalıştır.

do $$
declare
  uid uuid;
begin
  select id into uid from auth.users where email = '2024104512@ogrenci.example.com';
  if uid is null then
    raise exception 'Önce Authentication bölümünden 2024104512@ogrenci.example.com kullanıcısını oluştur.';
  end if;

  insert into public.ogrenciler
    (id, ad, ogrenci_no, bolum, sinif, eposta, danisman, genel_ortalama, akts, toplam_akts, devamsizlik_saat)
  values
    (uid, 'Ayşe Yılmaz', '2024104512', 'Bilgisayar Mühendisliği', 2, 'ayse.yilmaz@ogr.ornek.edu.tr',
     'Dr. Öğr. Üyesi K. Aksoy', 2.94, 60, 240, 6)
  on conflict (id) do nothing;

  insert into public.donemler (id, ad, sira) values
    (1, '2026–2027 Güz', 1),
    (2, '2025–2026 Bahar', 2)
  on conflict (id) do nothing;

  delete from public.notlar where ogrenci_id = uid;
  insert into public.notlar (ogrenci_id, donem_id, ders, vize, final, akts, harf) values
    (uid, 1, 'Veri Yapıları ve Algoritmalar', 78, null, 6, null),
    (uid, 1, 'Nesneye Yönelik Programlama', 88, null, 6, null),
    (uid, 1, 'Ayrık Matematik', 64, null, 5, null),
    (uid, 1, 'Sayısal Tasarım', 71, null, 5, null),
    (uid, 1, 'Olasılık ve İstatistik', 59, null, 5, null),
    (uid, 1, 'Teknik İngilizce', 92, null, 3, null),
    (uid, 2, 'Programlamaya Giriş II', 84, 90, 6, 'AA'),
    (uid, 2, 'Matematik II', 58, 66, 6, 'CC'),
    (uid, 2, 'Fizik II', 62, 71, 5, 'CB'),
    (uid, 2, 'Lineer Cebir', 70, 77, 5, 'BB'),
    (uid, 2, 'Elektrik Devre Temelleri', 55, 60, 5, 'DC'),
    (uid, 2, 'Türk Dili II', 85, 88, 2, 'BA');

  delete from public.ders_programi where ogrenci_id = uid;
  insert into public.ders_programi (ogrenci_id, gun, baslangic, bitis, ders, sinif, hoca) values
    (uid, 1, '09:00', '11:50', 'Veri Yapıları ve Algoritmalar', 'B-201', 'Dr. Öğr. Üyesi K. Aksoy'),
    (uid, 1, '13:00', '14:50', 'Ayrık Matematik', 'A-104', 'Doç. Dr. H. Tekin'),
    (uid, 2, '10:00', '11:50', 'Nesneye Yönelik Programlama', 'Lab 3', 'Dr. Öğr. Üyesi Z. Koç'),
    (uid, 2, '14:00', '15:50', 'Olasılık ve İstatistik', 'A-210', 'Prof. Dr. R. Güler'),
    (uid, 3, '09:00', '10:50', 'Sayısal Tasarım', 'B-105', 'Dr. Öğr. Üyesi C. Polat'),
    (uid, 3, '11:00', '12:50', 'Sayısal Tasarım (Lab)', 'Elektronik Lab', 'Arş. Gör. D. Eren'),
    (uid, 3, '15:00', '16:50', 'Teknik İngilizce', 'Uzaktan', 'Okt. L. Brown'),
    (uid, 4, '13:00', '15:50', 'Nesneye Yönelik Programlama (Lab)', 'Lab 3', 'Arş. Gör. T. Uçar');

  if not exists (select 1 from public.duyurular) then
    insert into public.duyurular (baslik, kimden, tarih, yeni) values
      ('Vize sınav programı yayınlandı', 'Öğrenci İşleri', '2026-11-18', true),
      ('Kütüphane hafta sonu açık', 'Kütüphane', '2026-11-15', false);
  end if;
end $$;
