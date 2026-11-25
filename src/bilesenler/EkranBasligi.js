import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { renk, yazi } from '../tema';

// Notlar, Program ve Profil ekranlarının üstündeki geri oku + başlık
export default function EkranBasligi({ baslik, geri }) {
  return (
    <View style={s.satir}>
      <Pressable onPress={geri} hitSlop={8} style={s.geri} accessibilityLabel="Geri">
        <Feather name="chevron-left" size={26} color={renk.metin} />
      </Pressable>
      <Text style={s.baslik}>{baslik}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  satir: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  geri: { width: 44, height: 44, marginLeft: -10, alignItems: 'center', justifyContent: 'center' },
  baslik: { fontFamily: yazi.baslik, fontSize: 24, color: renk.metin },
});
