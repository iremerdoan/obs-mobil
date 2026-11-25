import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { renk, yazi } from '../tema';

const sekmeler = [
  { ad: 'ana', yazi: 'Ana Sayfa', ikon: 'home' },
  { ad: 'notlar', yazi: 'Notlar', ikon: 'file-text' },
  { ad: 'program', yazi: 'Program', ikon: 'calendar' },
  { ad: 'profil', yazi: 'Profil', ikon: 'user' },
];

// Ekranın altındaki 4 sekmeli menü
export default function AltMenu({ aktif, git }) {
  const alt = useSafeAreaInsets().bottom;
  return (
    <View style={[s.menu, { paddingBottom: Math.max(alt, 10) }]}>
      {sekmeler.map((k) => {
        const secili = aktif === k.ad;
        const r = secili ? renk.ana : renk.ikincil;
        return (
          <Pressable
            key={k.ad}
            style={s.sekme}
            onPress={() => git(k.ad)}
            accessibilityRole="tab"
            accessibilityState={{ selected: secili }}
          >
            <Feather name={k.ikon} size={22} color={r} />
            <Text style={[s.yazi, { color: r, fontFamily: secili ? yazi.yariKalin : yazi.orta }]}>{k.yazi}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  menu: {
    flexDirection: 'row',
    backgroundColor: renk.yuzey,
    borderTopWidth: 1,
    borderTopColor: renk.cizgi,
    paddingTop: 8,
  },
  sekme: { flex: 1, alignItems: 'center', gap: 4, minHeight: 48, justifyContent: 'center' },
  yazi: { fontSize: 11 },
});
