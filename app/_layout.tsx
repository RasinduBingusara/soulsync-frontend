import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { useEffect, useState } from 'react';
import {getAuth, FirebaseAuthTypes, onAuthStateChanged as onAuthChanged } from '@react-native-firebase/auth';

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

  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) =>{
    
    const sanitizedUser = sanitizeUser(user);
    
    console.log('onAuthStateChanged', sanitizedUser);
    setUser(sanitizedUser);
    if (initializing) {
      setInitializing(false);
    }
  }
  useEffect(() => {
    const subscriber = onAuthChanged(getAuth(),onAuthStateChanged);
    return subscriber
  },[]);

  useEffect(() => {
    if(initializing) return;

    const inAuthGroup = segments[0] === '(tabs)';
    if(user && !inAuthGroup){
      router.replace('/(tabs)/home')
    }else if(!user && inAuthGroup){
      router.replace('/')
    }
  },[user, initializing])

  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{headerShown:false}}/>
        <Stack.Screen name="create_account" options={{headerShown:false}}/>
        <Stack.Screen name="forgot_password" options={{headerShown:false}}/>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(screen)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
