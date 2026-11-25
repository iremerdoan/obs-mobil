# OBS Mobil — Öğrenci Bilgi Sistemi

Telefondan giriş yapılan bir **Öğrenci Bilgi Sistemi** uygulaması. **React Native (Expo)** ile yazıldı; giriş ve veriler **Supabase** üzerinde (PostgreSQL + Row Level Security: her öğrenci yalnızca kendi verisini görür).

## Ekranlar

- **Giriş:** öğrenci numarası ve şifre, şifreyi göster/gizle, "Beni hatırla", boş alan uyarısı
- **Ana Sayfa:** genel ortalama, AKTS ve devamsızlık özeti, kısayollar, bugünkü dersler, duyurular
- **Notlarım:** döneme göre vize, final, AKTS ve harf notu; dönem ortalaması
- **Ders Programı:** gün seçince o günün dersleri, saatleri, sınıfları ve hocaları
- **Not Hesapla:** vize ve final notundan ortalama, harf notu, katsayı ve geçti/kaldı; sadece vize girilirse her harf için finalden gereken en düşük not; harf notu tablosu
- **Profil:** öğrenci bilgileri ve çıkış

## Kurulum

### 1. Supabase
1. [supabase.com](https://supabase.com) üzerinde yeni bir proje oluştur.
2. **SQL Editor** → `supabase/1-tablolar.sql` dosyasının içeriğini yapıştır → **Run**.
3. **Authentication → Users → Add user → Create new user**: e-posta `2024104512@ogrenci.example.com`, bir şifre, **Auto Confirm User** işaretli.
4. **SQL Editor** → `supabase/2-ornek-veri.sql` → **Run**.

### 2. Uygulama
1. `.env.example` dosyasını kopyalayıp adını `.env.local` yap; Supabase'deki **Project URL** ve **publishable (anon) key** değerlerini yaz.
2. Çalıştır:
   ```bash
   npm install
   npx expo start --lan
   ```
3. Expo Go ile aç; öğrenci numarası `2024104512` ve 3. adımdaki şifreyle giriş yap.

Uygulama giriş için öğrenci numarasını `numara@ogrenci.example.com` e-postasına çevirir.

## Dosyalar

| Dosya | Ne işe yarar |
|---|---|
| `App.js` | Giriş dosyası: oturum, verilerin yüklenmesi, sekmeler arası geçiş |
| `src/tema.js` | Renkler, harf notu renkleri, yazı tipleri |
| `src/supabase.js` | Supabase bağlantısı, giriş ve verileri çekme |
| `src/veri.js` | Sabit ayarlar: günler, harf notu ölçeği, not hesaplama ayarları |
| `supabase/` | Tabloları ve örnek veriyi kuran SQL dosyaları |
| `src/ekranlar/` | `Giris.js`, `AnaSayfa.js`, `Notlar.js`, `DersProgrami.js`, `NotHesapla.js`, `Profil.js` |
| `src/bilesenler/` | `AltMenu.js` (alt sekmeler), `EkranBasligi.js` (geri oku + başlık) |

## Henüz yapılmadı

- Uygulama verileri yalnızca okur; not ve program girişi Supabase panelinden yapılır.
- Harf notu ölçeği ve final barajı örnek değerler; kendi okulunun değerleri `src/veri.js` içindeki `harfOlcegi` ve `hesapAyarlari` kısmına yazılabilir.
- Devamsızlık, Transkript, Bildirimler ve "Şifremi unuttum" ekranları sonraki adımda.
