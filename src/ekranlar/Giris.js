import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { renk, yazi } from '../tema';
import { universite } from '../veri';
import { supabase, numaradanEposta } from '../supabase';

// Giriş ekranı. Numara ve şifre Supabase'e sorularak kontrol edilir.
// Giriş başarılı olunca App.js oturumun açıldığını kendisi fark eder.
export default function Giris() {
  const ust = useSafeAreaInsets().top;
  const [no, setNo] = useState('');
  const [sifre, setSifre] = useState('');
  const [sifreGoster, setSifreGoster] = useState(false);
  const [hatirla, setHatirla] = useState(true);
  const [hata, setHata] = useState('');
  const [bekliyor, setBekliyor] = useState(false);

  async function gonder() {
    if (bekliyor) return;
    if (no.trim().length === 0 || sifre.length === 0) {
      setHata('Öğrenci numaranı ve şifreni gir.');
      return;
    }
    setHata('');
    setBekliyor(true);
    // "Beni hatırla" kapalıysa uygulama bir sonraki açılışta çıkış yapar
    await AsyncStorage.setItem('beniHatirla', hatirla ? 'evet' : 'hayir');
    const { error } = await supabase.auth.signInWithPassword({
      email: numaradanEposta(no),
      password: sifre,
    });
    setBekliyor(false);
    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        setHata('Öğrenci numarası ya da şifre hatalı.');
      } else if (error.message.toLowerCase().includes('network')) {
        setHata('İnternet bağlantısı yok gibi görünüyor. Tekrar dene.');
      } else {
        setHata('Giriş yapılamadı: ' + error.message);
      }
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={[s.ust, { paddingTop: ust + 40 }]}>
          <View style={s.logo}>
            <Feather name="book-open" size={28} color="#FFFFFF" />
          </View>
          <Text style={s.baslik}>Öğrenci Bilgi Sistemi</Text>
          <Text style={s.universite}>{universite}</Text>
        </View>

        <View style={s.kart}>
          <Text style={s.kartBaslik}>Giriş yap</Text>

          <View style={s.alan}>
            <Text style={s.etiket}>Öğrenci numarası</Text>
            <TextInput
              value={no}
              onChangeText={setNo}
              placeholder="Örn. 2025123456"
              placeholderTextColor="#8A93A3"
              keyboardType="number-pad"
              style={s.girdi}
              accessibilityLabel="Öğrenci numarası"
            />
          </View>

          <View style={s.alan}>
            <Text style={s.etiket}>Şifre</Text>
            <View>
              <TextInput
                value={sifre}
                onChangeText={setSifre}
                placeholder="Şifreni gir"
                placeholderTextColor="#8A93A3"
                secureTextEntry={!sifreGoster}
                style={[s.girdi, { paddingRight: 52 }]}
                accessibilityLabel="Şifre"
                onSubmitEditing={gonder}
              />
              <Pressable
                onPress={() => setSifreGoster((g) => !g)}
                style={s.goz}
                accessibilityLabel={sifreGoster ? 'Şifreyi gizle' : 'Şifreyi göster'}
              >
                <Feather name={sifreGoster ? 'eye-off' : 'eye'} size={20} color={renk.ikincil} />
              </Pressable>
            </View>
          </View>

          <View style={s.satir}>
            <Pressable
              onPress={() => setHatirla((h) => !h)}
              style={s.hatirla}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: hatirla }}
            >
              <View style={[s.kutu, hatirla && s.kutuSecili]}>
                {hatirla && <Feather name="check" size={14} color="#FFFFFF" />}
              </View>
              <Text style={s.hatirlaYazi}>Beni hatırla</Text>
            </Pressable>
            <Pressable
              hitSlop={8}
              onPress={() => Alert.alert('Şifremi unuttum', 'Şifre sıfırlama sonraki adımda eklenecek.')}
            >
              <Text style={s.link}>Şifremi unuttum</Text>
            </Pressable>
          </View>

          {hata ? (
            <View style={s.hata}>
              <Feather name="alert-circle" size={16} color="#9F1239" />
              <Text style={s.hataYazi}>{hata}</Text>
            </View>
          ) : null}

          <Pressable
            onPress={gonder}
            disabled={bekliyor}
            style={({ pressed }) => [s.buton, (pressed || bekliyor) && { opacity: 0.85 }]}
          >
            {bekliyor ? <ActivityIndicator color="#FFFFFF" /> : <Text style={s.butonYazi}>Giriş yap</Text>}
          </Pressable>
        </View>

        <View style={{ flex: 1 }} />

        <View style={s.alt}>
          <Text style={s.altYazi}>Giriş yapamıyor musun?</Text>
          <Pressable hitSlop={8} onPress={() => Alert.alert('Öğrenci İşleri', 'İletişim bilgileri sonraki adımda eklenecek.')}>
            <Text style={s.link}>Öğrenci İşleri ile iletişime geç</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  ust: { backgroundColor: renk.anaKoyu, paddingHorizontal: 28, paddingBottom: 72, gap: 6 },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  baslik: { fontFamily: yazi.baslikKalin, fontSize: 32, lineHeight: 36, color: '#FFFFFF' },
  universite: { fontFamily: yazi.normal, fontSize: 15, color: '#DCE4F5' },

  kart: {
    marginTop: -40,
    marginHorizontal: 20,
    backgroundColor: renk.yuzey,
    borderRadius: 20,
    padding: 20,
    paddingTop: 24,
    gap: 16,
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  kartBaslik: { fontFamily: yazi.baslik, fontSize: 22, color: renk.metin },
  alan: { gap: 6 },
  etiket: { fontFamily: yazi.yariKalin, fontSize: 13, color: renk.koyuGri },
  girdi: {
    height: 50,
    borderWidth: 1,
    borderColor: renk.girisCizgi,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontFamily: yazi.normal,
    fontSize: 16,
    color: renk.metin,
    backgroundColor: renk.yuzey,
  },
  goz: { position: 'absolute', right: 3, top: 3, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  satir: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  hatirla: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 44 },
  kutu: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: renk.girisCizgi,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kutuSecili: { backgroundColor: renk.ana, borderColor: renk.ana },
  hatirlaYazi: { fontFamily: yazi.normal, fontSize: 14, color: renk.koyuGri },
  link: { fontFamily: yazi.yariKalin, fontSize: 14, color: renk.ana },
  hata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFE4E6',
    borderRadius: 10,
    padding: 10,
  },
  hataYazi: { fontFamily: yazi.orta, fontSize: 13, color: '#9F1239', flex: 1 },
  buton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: renk.ana,
    alignItems: 'center',
    justifyContent: 'center',
  },
  butonYazi: { fontFamily: yazi.yariKalin, fontSize: 16, color: '#FFFFFF' },

  alt: { alignItems: 'center', gap: 4, paddingVertical: 28 },
  altYazi: { fontFamily: yazi.normal, fontSize: 14, color: renk.ikincil },
});
