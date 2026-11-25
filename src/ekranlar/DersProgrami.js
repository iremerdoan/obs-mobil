import { useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { renk, yazi } from '../tema';
import { gunler, dersRenkleri } from '../veri';
import EkranBasligi from '../bilesenler/EkranBasligi';

export default function DersProgrami({ git, veri }) {
  const { program } = veri;
  // Açılışta bugünü seç; hafta sonuysa Pazartesi
  const bugun = new Date().getDay();
  const [gun, setGun] = useState(bugun >= 1 && bugun <= 5 ? bugun : 1);
  const dersler = program[gun] ?? [];
  const secilen = gunler.find((g) => g.id === gun);

  return (
    <View style={{ flex: 1 }}>
      <View style={s.ust}>
        <EkranBasligi baslik="Ders Programı" geri={() => git('ana')} />
        <View style={s.gunler}>
          {gunler.map((g) => {
            const secili = g.id === gun;
            return (
              <Pressable
                key={g.id}
                onPress={() => setGun(g.id)}
                style={[s.gun, secili && s.gunSecili]}
                accessibilityLabel={g.uzun}
                accessibilityState={{ selected: secili }}
              >
                <Text style={[s.gunKisa, secili && { color: '#FFFFFF' }]}>{g.kisa}</Text>
                <Text style={[s.gunSayi, secili && { color: '#FFFFFF' }]}>{(program[g.id] ?? []).length}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <ScrollView contentContainerStyle={s.liste}>
        <Text style={s.baslik}>
          {secilen.uzun.toLocaleUpperCase('tr-TR')} · {dersler.length} DERS
        </Text>

        {dersler.length === 0 && (
          <View style={s.bos}>
            <Text style={s.bosYazi}>Bu gün dersin yok.</Text>
          </View>
        )}

        {dersler.map((d, i) => (
          <View key={d.ad + d.bas} style={s.satir}>
            <View style={s.saat}>
              <Text style={s.saatBas}>{d.bas}</Text>
              <Text style={s.saatBit}>{d.bit}</Text>
            </View>
            <View style={[s.kart, { borderLeftColor: dersRenkleri[i % dersRenkleri.length] }]}>
              <Text style={s.dersAd}>{d.ad}</Text>
              <View style={s.bilgi}>
                <View style={s.sinif}>
                  <Feather name="map-pin" size={14} color={renk.koyuGri} />
                  <Text style={s.bilgiYazi}>{d.sinif}</Text>
                </View>
                <Text style={s.bilgiYazi}>{d.hoca}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  ust: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, gap: 14 },
  gunler: { flexDirection: 'row', gap: 8 },
  gun: {
    flex: 1,
    height: 64,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: renk.cizgi,
    backgroundColor: renk.yuzey,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  gunSecili: { backgroundColor: renk.ana, borderColor: renk.ana },
  gunKisa: { fontFamily: yazi.orta, fontSize: 12, color: renk.metin },
  gunSayi: { fontFamily: yazi.baslikKalin, fontSize: 18, color: renk.metin },
  liste: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 24, gap: 12 },
  baslik: { fontFamily: yazi.yariKalin, fontSize: 13, letterSpacing: 0.5, color: renk.ikincil },
  bos: {
    backgroundColor: renk.yuzey,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: renk.girisCizgi,
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
  },
  bosYazi: { fontFamily: yazi.normal, fontSize: 14, color: renk.ikincil },
  satir: { flexDirection: 'row', gap: 12 },
  saat: { width: 48, paddingTop: 14, alignItems: 'flex-end' },
  saatBas: { fontFamily: yazi.kalin, fontSize: 14, color: renk.metin },
  saatBit: { fontFamily: yazi.normal, fontSize: 12, color: renk.ikincil },
  kart: {
    flex: 1,
    backgroundColor: renk.yuzey,
    borderWidth: 1,
    borderColor: renk.cizgi,
    borderLeftWidth: 4,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 6,
  },
  dersAd: { fontFamily: yazi.yariKalin, fontSize: 15, color: renk.metin },
  bilgi: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  sinif: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  bilgiYazi: { fontFamily: yazi.normal, fontSize: 13, color: renk.koyuGri },
});
