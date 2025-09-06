import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { use, useCallback, useEffect, useState } from 'react';
import { getAuth, FirebaseAuthTypes, onAuthStateChanged as onAuthChanged } from '@react-native-firebase/auth';
import { getLanguagePreference } from '@/components/custom-function/LanguagePreference';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SanitizedUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
  photoURL: string | null;
} | null;

export default function RootLayout() {

  const router = useRouter();
  const segments = useSegments();

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<SanitizedUser>(null)
  const [languageCode, setLanguageCode] = useState<string | null>(null);
  const { i18n } = useTranslation();

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // Hide the splash screen once the app is ready
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  const sanitizeUser = (user: FirebaseAuthTypes.User | null) => {
    if (!user) {
      return null;
    }

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      emailVerified: user.emailVerified,
      photoURL: user.photoURL,
    };
  };

  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {

    const sanitizedUser = sanitizeUser(user);

    console.log('onAuthStateChanged', sanitizedUser);
    setUser(sanitizedUser);
    if (initializing) {
      setInitializing(false);
    }
  }
  useEffect(() => {
    const subscriber = onAuthChanged(getAuth(), onAuthStateChanged);
    return subscriber
  }, []);

  useEffect(() => {
    const uid = user?.uid.toString() || '';
    const getlanguage = async () => {
      try {
        const lcode = await getLanguagePreference(uid);
        if (lcode !== null) {
          await i18n.changeLanguage(lcode);
          await AsyncStorage.setItem('selected-language', lcode);
        }
        setLanguageCode(lcode);
      }
      catch (e) {
        console.error("Error retrieving language preference:", e);
      }
    }
    getlanguage();
  }, [user]);

  useEffect(() => {
    if (initializing) return;

    const inAuthGroup = segments[0] === '(tabs)';
    console.log(languageCode);
    if (user && !inAuthGroup && languageCode !== null) {
      router.replace('/(tabs)/home');
    }
    else if (user && !inAuthGroup && languageCode === null) {
      router.replace('/language_selector');
    }
    else if (!user && inAuthGroup && languageCode === null) {
      router.replace('/');
    }
  }, [user, initializing, languageCode])

  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="language_selector" options={{ headerShown: false }} />
        <Stack.Screen name="create_account" options={{ headerShown: false }} />
        <Stack.Screen name="forgot_password" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(screen)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
