import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';


export default function ScreenLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen name="task" options={{ headerShown: true, title: 'Task' }} />
        <Stack.Screen name="journal_create" options={{ headerShown: false }} />
        <Stack.Screen name="journal_edit" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}