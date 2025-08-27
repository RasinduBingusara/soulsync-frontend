import { useThemeColor } from '@/hooks/useThemeColor';
import { SafeAreaView,SafeAreaViewProps } from 'react-native-safe-area-context';

export type ThemedSafeAreaViewProps = SafeAreaViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedSafeAreaView({ style, lightColor, darkColor, ...otherProps }: ThemedSafeAreaViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <SafeAreaView style={[{ backgroundColor }, style]} {...otherProps} />;
}
