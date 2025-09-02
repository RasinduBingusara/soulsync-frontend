import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            
            position: 'absolute',
          },
          default: {},
        }),
      }}>
        
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />

      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color }) => <MaterialIcons name="groups" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="task-list"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color }) => <FontAwesome5 name="tasks" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="journal-list"
        options={{
          title: 'Journal',
          tabBarIcon: ({ color }) => <Ionicons name="journal" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="learning-zone"
        options={{
          title: 'Learning Zone',
          tabBarIcon: ({ color }) => <Ionicons name="book" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
