// Sabit ayarlar. Öğrenci, not, ders programı ve duyuru verileri artık Supabase'den geliyor
// (bkz. src/supabase.js ve supabase/ klasöründeki SQL dosyaları).

export const universite = '[ÜNİVERSİTE ADI]';

export const gunler = [
  { id: 1, kisa: 'Pzt', uzun: 'Pazartesi' },
  { id: 2, kisa: 'Sal', uzun: 'Salı' },
  { id: 3, kisa: 'Çar', uzun: 'Çarşamba' },
  { id: 4, kisa: 'Per', uzun: 'Perşembe' },
  { id: 5, kisa: 'Cum', uzun: 'Cuma' },
];

// Ders kartlarının sol çizgi renkleri sırayla bunlardan seçilir
export const dersRenkleri = ['#1D4ED8', '#EA580C', '#0F766E', '#7C3AED'];

// Not hesaplama ayarları. Bu ölçek ÖRNEKTİR: her üniversitenin yönetmeliği farklıdır,
// kendi okulunun değerlerini buraya yazarak değiştirebilirsin.
export const hesapAyarlari = {
  vizeEtkileri: [30, 40, 50], // vizenin ortalamaya etkisi (%), seçilebilir
  varsayilanVizeEtkisi: 40,
  finalBaraji: 50, // finalden bunun altında alan öğrenci notu ne olursa olsun kalır
};

// alt = o harf için gereken en düşük ortalama
export const harfOlcegi = [
  { harf: 'AA', alt: 90, katsayi: 4.0, durum: 'gecti' },
  { harf: 'BA', alt: 85, katsayi: 3.5, durum: 'gecti' },
  { harf: 'BB', alt: 80, katsayi: 3.0, durum: 'gecti' },
  { harf: 'CB', alt: 75, katsayi: 2.5, durum: 'gecti' },
  { harf: 'CC', alt: 65, katsayi: 2.0, durum: 'gecti' },
  { harf: 'DC', alt: 60, katsayi: 1.5, durum: 'kosullu' },
  { harf: 'DD', alt: 50, katsayi: 1.0, durum: 'kosullu' },
  { harf: 'FD', alt: 40, katsayi: 0.5, durum: 'kaldi' },
  { harf: 'FF', alt: 0, katsayi: 0.0, durum: 'kaldi' },
];

// Harf notlarından dönem ortalaması (AKTS ağırlıklı). Harfi girilmemiş ders varsa null döner.
export function donemOrtalamasi(dersler) {
  if (dersler.length === 0 || dersler.some((d) => !d.harf || d.harf === '—')) return null;
  let toplam = 0;
  let akts = 0;
  for (const d of dersler) {
    const h = harfOlcegi.find((x) => x.harf === d.harf);
    if (!h) return null;
    toplam += h.katsayi * d.akts;
    akts += d.akts;
  }
  return (toplam / akts).toFixed(2).replace('.', ',');
}
