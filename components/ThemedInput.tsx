import { useThemeColor } from '@/hooks/useThemeColor';
import { TextInput, StyleSheet, type TextInputProps } from 'react-native';

export type ThemedInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedInput({
  style,
  lightColor,
  darkColor,
  ...rest
}: ThemedInputProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const placeholderTextColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <TextInput
      style={[{ color }, style]}
      placeholderTextColor={placeholderTextColor}
      {...rest}
    />
  );
}