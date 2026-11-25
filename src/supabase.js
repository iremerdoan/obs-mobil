// Supabase bağlantısı. Adres ve anahtar .env.local dosyasından okunur
// (o dosya GitHub'a gitmez, .gitignore içinde).
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const adres = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anahtar = process.env.EXPO_PUBLIC_SUPABASE_KEY;

// .env.local doldurulmadıysa uygulama bunu ekranda söyler
export const ayarEksik = !adres || !anahtar;

export const supabase = ayarEksik
  ? null
  : createClient(adres, anahtar, {
      auth: {
        storage: AsyncStorage, // giriş bilgisi telefonda saklanır, uygulama kapanınca çıkış olmaz
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });

// Öğrenci numarasını Supabase'deki giriş e-postasına çevirir.
// Supabase e-posta ile giriş yaptığı için her öğrenci "numara@ogrenci.example.com" olarak kayıtlı.
export function numaradanEposta(no) {
  return `${no.trim()}@ogrenci.example.com`;
}

// Giriş yapan öğrencinin bütün verisini tek seferde çeker
export async function verileriGetir() {
  const [ogrenci, donemler, notlar, program, duyurular] = await Promise.all([
    supabase.from('ogrenciler').select('*').single(),
    supabase.from('donemler').select('*').order('sira'),
    supabase.from('notlar').select('*').order('id'),
    supabase.from('ders_programi').select('*').order('baslangic'),
    supabase.from('duyurular').select('*').order('tarih', { ascending: false }),
  ]);

  const hata = [ogrenci, donemler, notlar, program, duyurular].find((c) => c.error)?.error;
  if (hata) throw hata;

  const o = ogrenci.data;
  const ad = o.ad;
  const parcalar = ad.split(' ');
  const saat = (t) => t.slice(0, 5); // "09:00:00" → "09:00"

  // Ekranların beklediği şekle çeviriyoruz
  const programGunlere = {};
  for (const p of program.data) {
    (programGunlere[p.gun] ??= []).push({
      bas: saat(p.baslangic),
      bit: saat(p.bitis),
      ad: p.ders,
      sinif: p.sinif,
      hoca: p.hoca,
    });
  }

  return {
    ogrenci: {
      ad,
      bas: (parcalar[0][0] + (parcalar[parcalar.length - 1][0] ?? '')).toLocaleUpperCase('tr-TR'),
      no: o.ogrenci_no,
      bolum: o.bolum,
      sinif: o.sinif,
      eposta: o.eposta,
      danisman: o.danisman,
      genelOrtalama: o.genel_ortalama != null ? Number(o.genel_ortalama).toFixed(2).replace('.', ',') : '—',
      akts: o.akts,
      toplamAkts: o.toplam_akts,
      devamsizlikSaat: o.devamsizlik_saat,
    },
    donemler: donemler.data.map((d) => ({
      id: d.id,
      ad: d.ad,
      dersler: notlar.data
        .filter((n) => n.donem_id === d.id)
        .map((n) => ({ ad: n.ders, vize: n.vize, final: n.final, akts: n.akts, harf: n.harf ?? '—' })),
    })),
    program: programGunlere,
    duyurular: duyurular.data.map((d) => ({
      baslik: d.baslik,
      kimden: d.kimden,
      tarih: new Date(d.tarih).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' }),
      yeni: d.yeni,
    })),
  };
}
