import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { renk, yazi } from '../tema';
import { universite } from '../veri';
import EkranBasligi from '../bilesenler/EkranBasligi';

export default function Profil({ git, cikisYap, veri }) {
  const { ogrenci } = veri;
  const bilgiler = [
    { ikon: 'award', etiket: 'Öğrenci numarası', deger: ogrenci.no },
    { ikon: 'book', etiket: 'Bölüm', deger: `${ogrenci.bolum} · ${ogrenci.sinif}. sınıf` },
    { ikon: 'home', etiket: 'Üniversite', deger: universite },
    { ikon: 'user', etiket: 'Danışman', deger: ogrenci.danisman },
    { ikon: 'mail', etiket: 'E-posta', deger: ogrenci.eposta },
  ];

  return (
    <ScrollView contentContainerStyle={s.icerik}>
      <EkranBasligi baslik="Profil" geri={() => git('ana')} />

      <View style={s.kimlik}>
        <View style={s.avatar}>
          <Text style={s.avatarYazi}>{ogrenci.bas}</Text>
        </View>
        <Text style={s.ad}>{ogrenci.ad}</Text>
        <Text style={s.alt}>{ogrenci.bolum}</Text>
      </View>

      <View style={s.kart}>
        {bilgiler.map((b, i) => (
          <View key={b.etiket} style={[s.satir, i > 0 && s.ayrac]}>
            <Feather name={b.ikon} size={18} color={renk.ana} />
            <View style={{ flex: 1 }}>
              <Text style={s.etiket}>{b.etiket}</Text>
              <Text style={s.deger}>{b.deger}</Text>
            </View>
          </View>
        ))}
      </View>

      <Pressable onPress={cikisYap} style={({ pressed }) => [s.cikis, pressed && { opacity: 0.8 }]}>
        <Feather name="log-out" size={18} color="#9F1239" />
        <Text style={s.cikisYazi}>Çıkış yap</Text>
      </Pressable>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  icerik: { padding: 20, paddingTop: 16, gap: 20 },
  kimlik: { alignItems: 'center', gap: 4 },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: renk.anaAcik,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarYazi: { fontFamily: yazi.kalin, fontSize: 28, color: renk.anaKoyu },
  ad: { fontFamily: yazi.baslik, fontSize: 24, color: renk.metin },
  alt: { fontFamily: yazi.normal, fontSize: 14, color: renk.ikincil },
  kart: { backgroundColor: renk.yuzey, borderRadius: 16, borderWidth: 1, borderColor: renk.cizgi },
  satir: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: 16 },
  ayrac: { borderTopWidth: 1, borderTopColor: renk.cizgiAcik },
  etiket: { fontFamily: yazi.normal, fontSize: 12, color: renk.ikincil },
  deger: { fontFamily: yazi.yariKalin, fontSize: 15, color: renk.metin, marginTop: 2 },
  cikis: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FECDD3',
    backgroundColor: '#FFF1F2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cikisYazi: { fontFamily: yazi.yariKalin, fontSize: 16, color: '#9F1239' },
});
