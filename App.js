// OBS Mobil — uygulamanın giriş dosyası.
// Oturum (giriş yapıldı mı), Supabase'den gelen veriler ve açık sekme burada tutulur;
// ekranların kendisi src/ekranlar klasöründe.

import { useCallback, useEffect, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, BackHandler, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { SpaceGrotesk_600SemiBold } from '@expo-google-fonts/space-grotesk/600SemiBold';
import { SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk/700Bold';

import { renk, yazi } from './src/tema';
import { supabase, ayarEksik, verileriGetir } from './src/supabase';
import AltMenu from './src/bilesenler/AltMenu';
import Giris from './src/ekranlar/Giris';
import AnaSayfa from './src/ekranlar/AnaSayfa';
import Notlar from './src/ekranlar/Notlar';
import DersProgrami from './src/ekranlar/DersProgrami';
import Profil from './src/ekranlar/Profil';
import NotHesapla from './src/ekranlar/NotHesapla';

export default function App() {
  const [fontlarHazir] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });

  // oturum: undefined = henüz bakılmadı, null = giriş yok, nesne = giriş yapılmış
  const [oturum, setOturum] = useState(undefined);
  const [veri, setVeri] = useState(null);
  const [hata, setHata] = useState('');
  const [sekme, setSekme] = useState('ana');

  // Açılışta kayıtlı oturuma bak ve giriş/çıkışları dinle
  useEffect(() => {
    if (ayarEksik) return;
    (async () => {
      const hatirla = await AsyncStorage.getItem('beniHatirla');
      if (hatirla === 'hayir') {
        await supabase.auth.signOut();
        await AsyncStorage.removeItem('beniHatirla');
      }
      const { data } = await supabase.auth.getSession();
      setOturum(data.session);
    })();
    const { data } = supabase.auth.onAuthStateChange((_olay, yeniOturum) => {
      setOturum(yeniOturum);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const yukle = useCallback(async () => {
    setHata('');
    setVeri(null);
    try {
      setVeri(await verileriGetir());
    } catch (e) {
      setHata(
        e.code === 'PGRST116'
          ? 'Bu hesaba ait öğrenci kaydı bulunamadı. Supabase\'de 2-ornek-veri.sql dosyasını çalıştırdın mı?'
          : 'Veriler alınamadı: ' + (e.message ?? 'bilinmeyen hata')
      );
    }
  }, []);

  // Giriş yapılınca verileri çek, çıkış yapılınca temizle
  const kullaniciId = oturum?.user?.id;
  useEffect(() => {
    if (kullaniciId) {
      setSekme('ana');
      yukle();
    } else {
      setVeri(null);
    }
  }, [kullaniciId, yukle]);

  // Android geri tuşu: başka sekmedeysek ana sayfaya dön
  useEffect(() => {
    const dinleyici = BackHandler.addEventListener('hardwareBackPress', () => {
      if (oturum && sekme !== 'ana') {
        setSekme('ana');
        return true;
      }
      return false;
    });
    return () => dinleyici.remove();
  }, [oturum, sekme]);

  if (!fontlarHazir) return <View style={{ flex: 1, backgroundColor: renk.anaKoyu }} />;

  if (ayarEksik) {
    return (
      <Bilgi
        ikon="settings"
        baslik="Supabase ayarı eksik"
        yazi={'Proje klasöründe .env.local dosyasını oluştur, Supabase adresini ve anahtarını yaz, sonra Expo\'yu yeniden başlat.'}
      />
    );
  }

  if (oturum === undefined) return <Bilgi yukleniyor />;

  if (!oturum) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <View style={s.zemin}>
          <Giris />
        </View>
      </SafeAreaProvider>
    );
  }

  const cikisYap = () => supabase.auth.signOut();

  if (hata) {
    return (
      <Bilgi
        ikon="alert-circle"
        baslik="Bir sorun oldu"
        yazi={hata}
        buton="Tekrar dene"
        onPress={yukle}
        ikinciButon="Çıkış yap"
        ikinciOnPress={cikisYap}
      />
    );
  }

  if (!veri) return <Bilgi yukleniyor />;

  let ekran;
  if (sekme === 'ana') ekran = <AnaSayfa git={setSekme} veri={veri} />;
  if (sekme === 'notlar') ekran = <Notlar git={setSekme} veri={veri} />;
  if (sekme === 'program') ekran = <DersProgrami git={setSekme} veri={veri} />;
  if (sekme === 'hesapla') ekran = <NotHesapla git={setSekme} veri={veri} />;
  if (sekme === 'profil') ekran = <Profil git={setSekme} cikisYap={cikisYap} veri={veri} />;

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <SafeAreaView edges={['top']} style={s.zemin}>
        <View style={{ flex: 1 }}>{ekran}</View>
        <AltMenu aktif={sekme} git={setSekme} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// Yükleniyor / hata / ayar eksik ekranı
function Bilgi({ yukleniyor, ikon, baslik, yazi: metin, buton, onPress, ikinciButon, ikinciOnPress }) {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <View style={[s.zemin, s.ortala]}>
        {yukleniyor ? (
          <ActivityIndicator size="large" color={renk.ana} />
        ) : (
          <>
            <Feather name={ikon} size={40} color={renk.ana} />
            <Text style={s.bilgiBaslik}>{baslik}</Text>
            <Text style={s.bilgiYazi}>{metin}</Text>
            {buton && (
              <Pressable onPress={onPress} style={s.buton}>
                <Text style={s.butonYazi}>{buton}</Text>
              </Pressable>
            )}
            {ikinciButon && (
              <Pressable onPress={ikinciOnPress} hitSlop={10} style={{ marginTop: 4 }}>
                <Text style={s.link}>{ikinciButon}</Text>
              </Pressable>
            )}
          </>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  zemin: { flex: 1, backgroundColor: renk.zemin },
  ortala: { alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  bilgiBaslik: { fontFamily: yazi.baslik, fontSize: 22, color: renk.metin, textAlign: 'center' },
  bilgiYazi: { fontFamily: yazi.normal, fontSize: 15, lineHeight: 22, color: renk.ikincil, textAlign: 'center' },
  buton: {
    height: 50,
    paddingHorizontal: 28,
    borderRadius: 14,
    backgroundColor: renk.ana,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  butonYazi: { fontFamily: yazi.yariKalin, fontSize: 16, color: '#FFFFFF' },
  link: { fontFamily: yazi.yariKalin, fontSize: 15, color: renk.ana },
});
