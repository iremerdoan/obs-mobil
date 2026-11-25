import { useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { renk, yazi, harfRenk } from '../tema';
import { donemOrtalamasi } from '../veri';
import EkranBasligi from '../bilesenler/EkranBasligi';

export default function Notlar({ git, veri }) {
  const { donemler } = veri;
  const [donemId, setDonemId] = useState(donemler[0]?.id);
  const donem = donemler.find((d) => d.id === donemId) ?? { dersler: [] };
  const ortalama = donemOrtalamasi(donem.dersler);

  return (
    <View style={{ flex: 1 }}>
      <View style={s.ust}>
        <EkranBasligi baslik="Notlarım" geri={() => git('ana')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {donemler.map((d) => {
            const secili = d.id === donemId;
            return (
              <Pressable
                key={d.id}
                onPress={() => setDonemId(d.id)}
                style={[s.cip, secili && s.cipSecili]}
                accessibilityState={{ selected: secili }}
              >
                <Text style={[s.cipYazi, secili && { color: '#FFFFFF' }]}>{d.ad}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={s.liste}>
        {donem.dersler.map((d) => {
          const r = harfRenk[d.harf] ?? harfRenk['—'];
          return (
            <View key={d.ad} style={s.kart}>
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={s.dersAd} numberOfLines={1}>
                  {d.ad}
                </Text>
                <View style={s.notlar}>
                  <Text style={s.not}>
                    Vize <Text style={s.notDeger}>{d.vize ?? '—'}</Text>
                  </Text>
                  <Text style={s.not}>
                    Final <Text style={s.notDeger}>{d.final ?? '—'}</Text>
                  </Text>
                  <Text style={s.not}>{d.akts} AKTS</Text>
                </View>
              </View>
              <View style={[s.harf, { backgroundColor: r.zemin }]}>
                <Text style={[s.harfYazi, { color: r.yazi }]}>{d.harf}</Text>
              </View>
            </View>
          );
        })}

        <View style={[s.kart, s.ortalama]}>
          <Text style={s.ortalamaEtiket}>Dönem ortalaması</Text>
          {ortalama ? (
            <Text style={s.ortalamaDeger}>{ortalama}</Text>
          ) : (
            <Text style={s.bekleniyor}>Finaller bekleniyor</Text>
          )}
        </View>

        <Pressable onPress={() => git('hesapla')} style={({ pressed }) => [s.hesapla, pressed && { opacity: 0.85 }]}>
          <Feather name="percent" size={18} color="#FFFFFF" />
          <Text style={s.hesaplaYazi}>Not hesapla</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  ust: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, gap: 14 },
  cip: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: renk.girisCizgi,
    backgroundColor: renk.yuzey,
    justifyContent: 'center',
  },
  cipSecili: { backgroundColor: renk.ana, borderColor: renk.ana },
  cipYazi: { fontFamily: yazi.yariKalin, fontSize: 14, color: renk.koyuGri },
  liste: { paddingHorizontal: 20, paddingBottom: 24, gap: 10 },
  kart: {
    backgroundColor: renk.yuzey,
    borderWidth: 1,
    borderColor: renk.cizgi,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dersAd: { fontFamily: yazi.yariKalin, fontSize: 15, color: renk.metin },
  notlar: { flexDirection: 'row', gap: 14 },
  not: { fontFamily: yazi.normal, fontSize: 12, color: renk.ikincil },
  notDeger: { fontFamily: yazi.yariKalin, color: renk.metin },
  harf: { minWidth: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  harfYazi: { fontFamily: yazi.baslikKalin, fontSize: 16 },
  ortalama: { justifyContent: 'space-between', marginTop: 6, paddingVertical: 14, paddingHorizontal: 16 },
  ortalamaEtiket: { fontFamily: yazi.normal, fontSize: 14, color: renk.ikincil },
  ortalamaDeger: { fontFamily: yazi.baslikKalin, fontSize: 22, color: renk.metin },
  hesapla: {
    height: 52,
    borderRadius: 14,
    backgroundColor: renk.ana,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  hesaplaYazi: { fontFamily: yazi.yariKalin, fontSize: 16, color: '#FFFFFF' },
  bekleniyor: { fontFamily: yazi.yariKalin, fontSize: 14, color: renk.metin },
});
