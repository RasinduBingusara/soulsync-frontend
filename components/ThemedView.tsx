import { View, StyleSheet, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  style?: object;
  backgroundVisible?: boolean;
};


export function ThemedView({ style, lightColor, darkColor, backgroundVisible = true, ...otherProps }:ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[style, backgroundVisible ? { backgroundColor } : {}]} {...otherProps} />;
}
