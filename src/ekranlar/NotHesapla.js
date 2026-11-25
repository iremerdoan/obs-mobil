import { useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { renk, yazi, harfRenk, durumRenk } from '../tema';
import { hesapAyarlari, harfOlcegi } from '../veri';
import EkranBasligi from '../bilesenler/EkranBasligi';

// Yazılan metni 0–100 arası bir nota çevirir. Boşsa null döner.
function notOku(metin) {
  if (metin === '') return null;
  const sayi = parseInt(metin, 10);
  if (Number.isNaN(sayi)) return null;
  return Math.min(100, Math.max(0, sayi));
}

// Ortalamaya göre harf notunu bulur (ölçek büyükten küçüğe sıralı)
function harfBul(ortalama) {
  return harfOlcegi.find((h) => ortalama >= h.alt);
}

export default function NotHesapla({ git, veri }) {
  const [vizeMetin, setVizeMetin] = useState('');
  const [finalMetin, setFinalMetin] = useState('');
  const [etki, setEtki] = useState(hesapAyarlari.varsayilanVizeEtkisi);
  const [secilenDers, setSecilenDers] = useState(null);

  const vize = notOku(vizeMetin);
  const final = notOku(finalMetin);
  const baraj = hesapAyarlari.finalBaraji;

  // Sadece rakam yazılabilsin, 100'ü geçmesin
  function temizle(metin) {
    const rakam = metin.replace(/[^0-9]/g, '').slice(0, 3);
    if (rakam === '') return '';
    return String(Math.min(100, parseInt(rakam, 10)));
  }

  function dersSec(ders) {
    setSecilenDers(ders.ad);
    setVizeMetin(ders.vize != null ? String(ders.vize) : '');
    setFinalMetin(ders.final != null ? String(ders.final) : '');
  }

  // --- Sonuç ---
  let sonuc = null;
  if (vize != null && final != null) {
    const ortalama = (vize * etki + final * (100 - etki)) / 100;
    const yuvarlak = Math.round(ortalama);
    const barajAlti = final < baraj;
    const harf = barajAlti ? harfOlcegi[harfOlcegi.length - 1] : harfBul(yuvarlak);
    sonuc = { ortalama, harf, barajAlti };
  }

  // --- Sadece vize varsa: her harf için finalden en az kaç gerekir? ---
  let gerekenler = null;
  if (vize != null && final == null) {
    gerekenler = harfOlcegi
      .filter((h) => h.durum !== 'kaldi')
      .map((h) => {
        // yuvarlanmış ortalama >= h.alt olmalı → ortalama >= h.alt - 0,5
        const hesap = Math.ceil(((h.alt * 100 - 50) - vize * etki) / (100 - etki));
        const gerekli = Math.max(hesap, baraj, 0);
        return { ...h, gerekli: gerekli > 100 ? null : gerekli };
      });
  }

  const aktifDersler = veri.donemler[0]?.dersler ?? [];

  return (
    <ScrollView contentContainerStyle={s.icerik} keyboardShouldPersistTaps="handled">
      <EkranBasligi baslik="Not Hesapla" geri={() => git('ana')} />

      {/* Kendi dersinden doldur */}
      <View style={{ gap: 8 }}>
        <Text style={s.etiket}>Dersinden doldur</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {aktifDersler.map((d) => {
            const secili = secilenDers === d.ad;
            return (
              <Pressable key={d.ad} onPress={() => dersSec(d)} style={[s.cip, secili && s.cipSecili]}>
                <Text style={[s.cipYazi, secili && { color: '#FFFFFF' }]}>{d.ad}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Not girişleri */}
      <View style={s.kart}>
        <View style={s.girisSatiri}>
          <View style={s.alan}>
            <Text style={s.etiket}>Vize</Text>
            <TextInput
              value={vizeMetin}
              onChangeText={(m) => {
                setVizeMetin(temizle(m));
                setSecilenDers(null);
              }}
              keyboardType="number-pad"
              placeholder="0–100"
              placeholderTextColor="#8A93A3"
              style={s.girdi}
              accessibilityLabel="Vize notu"
              maxLength={3}
            />
          </View>
          <View style={s.alan}>
            <Text style={s.etiket}>Final</Text>
            <TextInput
              value={finalMetin}
              onChangeText={(m) => {
                setFinalMetin(temizle(m));
                setSecilenDers(null);
              }}
              keyboardType="number-pad"
              placeholder="0–100"
              placeholderTextColor="#8A93A3"
              style={s.girdi}
              accessibilityLabel="Final notu"
              maxLength={3}
            />
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <Text style={s.etiket}>Vizenin ortalamaya etkisi</Text>
          <View style={s.etkiler}>
            {hesapAyarlari.vizeEtkileri.map((e) => {
              const secili = e === etki;
              return (
                <Pressable key={e} onPress={() => setEtki(e)} style={[s.etki, secili && s.etkiSecili]}>
                  <Text style={[s.etkiYazi, secili && { color: '#FFFFFF' }]}>
                    %{e} / %{100 - e}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {(vizeMetin !== '' || finalMetin !== '') && (
          <Pressable
            onPress={() => {
              setVizeMetin('');
              setFinalMetin('');
              setSecilenDers(null);
            }}
            hitSlop={8}
            style={{ alignSelf: 'flex-start' }}
          >
            <Text style={s.link}>Temizle</Text>
          </Pressable>
        )}
      </View>

      {/* Sonuç kartı */}
      {sonuc && (
        <View style={s.sonuc}>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={s.sonucEtiket}>Ortalaman</Text>
            <Text style={s.sonucSayi}>{sonuc.ortalama.toLocaleString('tr-TR', { maximumFractionDigits: 1 })}</Text>
            <Text style={s.sonucEtiket}>Katsayı {sonuc.harf.katsayi.toFixed(2).replace('.', ',')}</Text>
          </View>
          <View style={{ alignItems: 'center', gap: 8 }}>
            <View style={[s.buyukHarf, { backgroundColor: harfRenk[sonuc.harf.harf].zemin }]}>
              <Text style={[s.buyukHarfYazi, { color: harfRenk[sonuc.harf.harf].yazi }]}>{sonuc.harf.harf}</Text>
            </View>
            <Text style={[s.durum, { backgroundColor: durumRenk[sonuc.harf.durum].zemin, color: durumRenk[sonuc.harf.durum].yazi }]}>
              {durumRenk[sonuc.harf.durum].yaziUzun}
            </Text>
          </View>
        </View>
      )}
      {sonuc?.barajAlti && (
        <View style={s.uyari}>
          <Feather name="alert-circle" size={16} color="#9F1239" />
          <Text style={s.uyariYazi}>
            Finalden en az {baraj} alman gerekiyor. Ortalaman ne olursa olsun bu durumda ders FF sayılır.
          </Text>
        </View>
      )}

      {/* Finalden kaç almalıyım? */}
      {gerekenler && (
        <View style={s.kart}>
          <Text style={s.kartBaslik}>Finalden en az kaç almalısın?</Text>
          <Text style={s.aciklama}>Vizen {vize}, vize etkisi %{etki}</Text>
          {gerekenler.map((g, i) => (
            <View key={g.harf} style={[s.satir, i > 0 && s.ayrac]}>
              <View style={[s.kucukHarf, { backgroundColor: harfRenk[g.harf].zemin }]}>
                <Text style={[s.kucukHarfYazi, { color: harfRenk[g.harf].yazi }]}>{g.harf}</Text>
              </View>
              <Text style={s.satirYazi}>{g.harf} için</Text>
              <Text style={[s.gerekli, g.gerekli == null && s.imkansiz]}>
                {g.gerekli == null ? 'Mümkün değil' : g.gerekli}
              </Text>
            </View>
          ))}
        </View>
      )}

      {!sonuc && !gerekenler && (
        <Text style={s.ipucu}>
          Vize ve final notunu yaz, ortalamanı ve harf notunu hesaplayalım. Sadece vizeyi yazarsan finalden kaç
          alman gerektiğini gösteririz.
        </Text>
      )}

      {/* Harf notu tablosu */}
      <View style={s.kart}>
        <Text style={s.kartBaslik}>Harf notu karşılıkları</Text>
        <View style={[s.tabloSatir, s.tabloBaslik]}>
          <Text style={[s.tabloHucre, s.tabloBaslikYazi]}>Harf</Text>
          <Text style={[s.tabloHucre, s.tabloBaslikYazi]}>Puan</Text>
          <Text style={[s.tabloHucre, s.tabloBaslikYazi]}>Katsayı</Text>
          <Text style={[s.tabloHucre, s.tabloBaslikYazi, { flex: 1.4 }]}>Durum</Text>
        </View>
        {harfOlcegi.map((h, i) => {
          const ust = i === 0 ? 100 : harfOlcegi[i - 1].alt - 1;
          const aktif = sonuc && sonuc.harf.harf === h.harf;
          return (
            <View key={h.harf} style={[s.tabloSatir, aktif && { backgroundColor: renk.anaAcik }]}>
              <Text style={[s.tabloHucre, s.tabloHarf, { color: harfRenk[h.harf].yazi }]}>{h.harf}</Text>
              <Text style={s.tabloHucre}>
                {h.alt}–{ust}
              </Text>
              <Text style={s.tabloHucre}>{h.katsayi.toFixed(2).replace('.', ',')}</Text>
              <Text style={[s.tabloHucre, { flex: 1.4, color: durumRenk[h.durum].yazi }]}>
                {durumRenk[h.durum].yaziUzun}
              </Text>
            </View>
          );
        })}
        <Text style={s.not}>
          Bu ölçek örnektir; harf aralıkları ve final barajı üniversiteye göre değişebilir.
        </Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  icerik: { padding: 20, paddingTop: 16, gap: 16, paddingBottom: 32 },
  etiket: { fontFamily: yazi.yariKalin, fontSize: 13, color: renk.koyuGri },
  link: { fontFamily: yazi.yariKalin, fontSize: 14, color: renk.ana },
  cip: {
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: renk.girisCizgi,
    backgroundColor: renk.yuzey,
    justifyContent: 'center',
  },
  cipSecili: { backgroundColor: renk.ana, borderColor: renk.ana },
  cipYazi: { fontFamily: yazi.orta, fontSize: 13, color: renk.koyuGri },

  kart: {
    backgroundColor: renk.yuzey,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: renk.cizgi,
    padding: 16,
    gap: 14,
  },
  kartBaslik: { fontFamily: yazi.baslik, fontSize: 18, color: renk.metin },
  aciklama: { fontFamily: yazi.normal, fontSize: 13, color: renk.ikincil, marginTop: -8 },
  girisSatiri: { flexDirection: 'row', gap: 12 },
  alan: { flex: 1, gap: 6 },
  girdi: {
    height: 56,
    borderWidth: 1,
    borderColor: renk.girisCizgi,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontFamily: yazi.baslikKalin,
    fontSize: 24,
    color: renk.metin,
    backgroundColor: renk.yuzey,
  },
  etkiler: { flexDirection: 'row', gap: 8 },
  etki: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: renk.girisCizgi,
    alignItems: 'center',
    justifyContent: 'center',
  },
  etkiSecili: { backgroundColor: renk.ana, borderColor: renk.ana },
  etkiYazi: { fontFamily: yazi.yariKalin, fontSize: 13, color: renk.koyuGri },

  sonuc: {
    backgroundColor: renk.anaKoyu,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  sonucEtiket: { fontFamily: yazi.normal, fontSize: 13, color: renk.soluk },
  sonucSayi: { fontFamily: yazi.baslikKalin, fontSize: 44, lineHeight: 50, color: '#FFFFFF' },
  buyukHarf: { width: 76, height: 76, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  buyukHarfYazi: { fontFamily: yazi.baslikKalin, fontSize: 32 },
  durum: {
    fontFamily: yazi.yariKalin,
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
  },
  uyari: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    backgroundColor: '#FFE4E6',
    borderRadius: 12,
    padding: 12,
    marginTop: -6,
  },
  uyariYazi: { flex: 1, fontFamily: yazi.orta, fontSize: 13, color: '#9F1239', lineHeight: 19 },

  satir: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 10 },
  ayrac: { borderTopWidth: 1, borderTopColor: renk.cizgiAcik },
  kucukHarf: { width: 40, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  kucukHarfYazi: { fontFamily: yazi.baslikKalin, fontSize: 14 },
  satirYazi: { flex: 1, fontFamily: yazi.normal, fontSize: 14, color: renk.koyuGri },
  gerekli: { fontFamily: yazi.baslikKalin, fontSize: 20, color: renk.metin },
  imkansiz: { fontFamily: yazi.orta, fontSize: 14, color: renk.ikincil },
  ipucu: {
    fontFamily: yazi.normal,
    fontSize: 14,
    color: renk.ikincil,
    lineHeight: 21,
    textAlign: 'center',
    paddingHorizontal: 8,
  },

  tabloSatir: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 6, borderRadius: 8 },
  tabloBaslik: { borderBottomWidth: 1, borderBottomColor: renk.cizgi, borderRadius: 0, marginTop: -4 },
  tabloBaslikYazi: { fontFamily: yazi.yariKalin, fontSize: 12, color: renk.ikincil },
  tabloHucre: { flex: 1, fontFamily: yazi.normal, fontSize: 14, color: renk.metin },
  tabloHarf: { fontFamily: yazi.baslikKalin, fontSize: 15 },
  not: { fontFamily: yazi.normal, fontSize: 12, color: renk.ikincil, lineHeight: 18 },
});
