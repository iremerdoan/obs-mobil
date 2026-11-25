// OBS Mobil renkleri ve yazı tipleri (tasarımdaki değerler)

export const renk = {
  zemin: '#F4F6FA', // sayfa arka planı
  yuzey: '#FFFFFF', // kartlar
  metin: '#0F172A',
  ikincil: '#5B6474',
  koyuGri: '#3B4252',
  cizgi: '#DDE2EA',
  cizgiAcik: '#EDF0F5',
  girisCizgi: '#CBD2DE',
  ana: '#1D4ED8', // butonlar, seçili öğeler
  anaKoyu: '#1E3A8A', // üst alanlar, özet kartı
  anaAcik: '#DCE6FB',
  soluk: '#C7D3EE', // koyu zemin üstündeki açık yazılar
  turuncu: '#EA580C',
};

// Harf notu rozetlerinin renkleri
export const harfRenk = {
  AA: { zemin: '#DCFCE7', yazi: '#166534' },
  BA: { zemin: '#DCFCE7', yazi: '#166534' },
  BB: { zemin: '#DBEAFE', yazi: '#1E40AF' },
  CB: { zemin: '#DBEAFE', yazi: '#1E40AF' },
  CC: { zemin: '#FEF3C7', yazi: '#92400E' },
  DC: { zemin: '#FFEDD5', yazi: '#9A3412' },
  DD: { zemin: '#FFEDD5', yazi: '#9A3412' },
  FD: { zemin: '#FFE4E6', yazi: '#9F1239' },
  FF: { zemin: '#FFE4E6', yazi: '#9F1239' },
  '—': { zemin: '#EDF0F5', yazi: '#5B6474' },
};

// Geçti / koşullu / kaldı etiketlerinin renkleri
export const durumRenk = {
  gecti: { zemin: '#DCFCE7', yazi: '#166534', yaziUzun: 'Geçti' },
  kosullu: { zemin: '#FFEDD5', yazi: '#9A3412', yaziUzun: 'Koşullu geçti' },
  kaldi: { zemin: '#FFE4E6', yazi: '#9F1239', yaziUzun: 'Kaldı' },
};

// App.js içinde useFonts ile yüklenen yazı tipleri
export const yazi = {
  normal: 'Inter_400Regular',
  orta: 'Inter_500Medium',
  yariKalin: 'Inter_600SemiBold',
  kalin: 'Inter_700Bold',
  baslik: 'SpaceGrotesk_600SemiBold',
  baslikKalin: 'SpaceGrotesk_700Bold',
};
