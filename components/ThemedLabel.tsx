import { useThemeColor } from '@/hooks/useThemeColor';
import { StyleSheet, Text, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
  fontColor?: string;
  fontSize?: number;
};

export function ThemedLabel({
  style,
  lightColor,
  darkColor,
  fontColor,
  fontSize,
  ...rest
}: ThemedTextProps) {
  const color = fontColor===''? fontColor:useThemeColor({light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[style, { color, backgroundColor: useThemeColor({ light: lightColor, dark: darkColor }, 'background') }]}
      {...rest}
    />
  );
}
