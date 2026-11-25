import { ScrollView, View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { renk, yazi } from '../tema';
import { dersRenkleri } from '../veri';

const kisayollar = [
  { yazi: 'Notlar', ikon: 'file-text', hedef: 'notlar' },
  { yazi: 'Program', ikon: 'calendar', hedef: 'program' },
  { yazi: 'Not Hesapla', ikon: 'percent', hedef: 'hesapla' },
  { yazi: 'Devamsızlık', ikon: 'clock' },
];

export default function AnaSayfa({ git, veri }) {
  const { ogrenci, program, duyurular } = veri;
  // Bugünün dersleri (0 = Pazar, 6 = Cumartesi → hafta sonu ders yok)
  const bugun = new Date().getDay();
  const bugunkuDersler = program[bugun] ?? [];

  return (
    <ScrollView contentContainerStyle={s.icerik}>
      {/* Selamlama */}
      <View style={s.ustSatir}>
        <View style={s.avatar}>
          <Text style={s.avatarYazi}>{ogrenci.bas}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.merhaba}>Merhaba,</Text>
          <Text style={s.ad}>{ogrenci.ad}</Text>
        </View>
        <Pressable
          style={s.zil}
          accessibilityLabel="Bildirimler"
          onPress={() => Alert.alert('Bildirimler', 'Bildirimler sonraki adımda eklenecek.')}
        >
          <Feather name="bell" size={20} color={renk.metin} />
          <View style={s.nokta} />
        </Pressable>
      </View>

      {/* Özet kartı */}
      <View style={s.ozet}>
        <View>
          <Text style={s.ozetUst}>
            {ogrenci.bolum} · {ogrenci.sinif}. sınıf
          </Text>
          <Text style={s.ozetUst}>No: {ogrenci.no}</Text>
        </View>
        <View style={s.ozetSayilar}>
          <Sayi deger={ogrenci.genelOrtalama} etiket="Genel ort." />
          <Sayi deger={String(ogrenci.akts)} ek={`/${ogrenci.toplamAkts}`} etiket="AKTS" />
          <Sayi deger={String(ogrenci.devamsizlikSaat)} ek=" saat" etiket="Devamsızlık" />
        </View>
      </View>

      {/* Kısayollar */}
      <View style={s.kisayollar}>
        {kisayollar.map((k) => (
          <Pressable
            key={k.yazi}
            style={s.kisayol}
            onPress={() =>
              k.hedef ? git(k.hedef) : Alert.alert(k.yazi, 'Bu ekran sonraki adımda eklenecek.')
            }
          >
            <View style={s.kisayolKutu}>
              <Feather name={k.ikon} size={24} color={renk.ana} />
            </View>
            <Text style={s.kisayolYazi}>{k.yazi}</Text>
          </Pressable>
        ))}
      </View>

      {/* Bugünkü dersler */}
      <View style={s.bolum}>
        <View style={s.bolumUst}>
          <Text style={s.bolumBaslik}>Bugünkü dersler</Text>
          <Pressable onPress={() => git('program')} hitSlop={10}>
            <Text style={s.link}>Tümü</Text>
          </Pressable>
        </View>
        <View style={s.kart}>
          {bugunkuDersler.length === 0 ? (
            <Text style={s.bos}>Bugün dersin yok. İyi dinlenmeler!</Text>
          ) : (
            bugunkuDersler.map((d, i) => (
              <View key={d.ad + d.bas} style={[s.ders, i > 0 && s.dersAyrac]}>
                <View style={s.saat}>
                  <Text style={s.saatBas}>{d.bas}</Text>
                  <Text style={s.saatBit}>{d.bit}</Text>
                </View>
                <View style={[s.dersCizgi, { backgroundColor: dersRenkleri[i % dersRenkleri.length] }]} />
                <View style={{ flex: 1 }}>
                  <Text style={s.dersAd}>{d.ad}</Text>
                  <Text style={s.dersAlt}>
                    {d.sinif} · {d.hoca}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </View>

      {/* Duyurular */}
      <View style={s.bolum}>
        <Text style={s.bolumBaslik}>Duyurular</Text>
        {duyurular.map((d) => (
          <View key={d.baslik} style={[s.kart, s.duyuru]}>
            {d.yeni && <Text style={s.yeni}>YENİ</Text>}
            <View style={{ flex: 1 }}>
              <Text style={s.duyuruBaslik}>{d.baslik}</Text>
              <Text style={s.dersAlt}>
                {d.kimden} · {d.tarih}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function Sayi({ deger, ek, etiket }) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={s.sayi}>
        {deger}
        {ek ? <Text style={s.sayiEk}>{ek}</Text> : null}
      </Text>
      <Text style={s.ozetUst}>{etiket}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  icerik: { padding: 20, paddingTop: 24, gap: 20 },
  ustSatir: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: renk.anaAcik,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarYazi: { fontFamily: yazi.kalin, fontSize: 17, color: renk.anaKoyu },
  merhaba: { fontFamily: yazi.normal, fontSize: 13, color: renk.ikincil },
  ad: { fontFamily: yazi.baslik, fontSize: 22, color: renk.metin },
  zil: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: renk.cizgi,
    backgroundColor: renk.yuzey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nokta: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: renk.turuncu,
    borderWidth: 2,
    borderColor: renk.yuzey,
  },

  ozet: { backgroundColor: renk.anaKoyu, borderRadius: 20, padding: 18, paddingHorizontal: 20, gap: 14 },
  ozetUst: { fontFamily: yazi.normal, fontSize: 13, color: renk.soluk },
  ozetSayilar: { flexDirection: 'row', gap: 10 },
  sayi: { fontFamily: yazi.baslikKalin, fontSize: 26, color: '#FFFFFF' },
  sayiEk: { fontSize: 15, color: renk.soluk },

  kisayollar: { flexDirection: 'row', justifyContent: 'space-between' },
  kisayol: { alignItems: 'center', gap: 8, width: 76 },
  kisayolKutu: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: renk.yuzey,
    borderWidth: 1,
    borderColor: renk.cizgi,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kisayolYazi: { fontFamily: yazi.orta, fontSize: 12, color: renk.metin },

  bolum: { gap: 10 },
  bolumUst: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  bolumBaslik: { fontFamily: yazi.baslik, fontSize: 18, color: renk.metin },
  link: { fontFamily: yazi.yariKalin, fontSize: 13, color: renk.ana },
  kart: { backgroundColor: renk.yuzey, borderRadius: 16, borderWidth: 1, borderColor: renk.cizgi },
  bos: { fontFamily: yazi.normal, fontSize: 14, color: renk.ikincil, padding: 18, textAlign: 'center' },
  ders: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: 16 },
  dersAyrac: { borderTopWidth: 1, borderTopColor: renk.cizgiAcik },
  saat: { width: 52, alignItems: 'center' },
  saatBas: { fontFamily: yazi.kalin, fontSize: 15, color: renk.metin },
  saatBit: { fontFamily: yazi.normal, fontSize: 12, color: renk.ikincil },
  dersCizgi: { width: 3, alignSelf: 'stretch', borderRadius: 2 },
  dersAd: { fontFamily: yazi.yariKalin, fontSize: 15, color: renk.metin },
  dersAlt: { fontFamily: yazi.normal, fontSize: 13, color: renk.ikincil, marginTop: 2 },
  duyuru: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', padding: 14, paddingHorizontal: 16 },
  yeni: {
    fontFamily: yazi.kalin,
    fontSize: 11,
    letterSpacing: 0.5,
    color: '#9A3412',
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  duyuruBaslik: { fontFamily: yazi.yariKalin, fontSize: 14, color: renk.metin },
});
