// Separator.js
import React from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type SeperatorViewProps = ViewProps & {
    lightColor?: string;
    darkColor?: string;
    margin?: number;
}

export function Separator(
    { margin = 0, lightColor, darkColor, ...otherProps }: SeperatorViewProps) {
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

    return <View style={[{margin}, styles.separator]} />;
}

const styles = StyleSheet.create({
  separator: {
    height: 1, // Determines the thickness of the line
    backgroundColor: '#3b3b3bff', // Sets the color of the line
    marginVertical: 5, // Adds space above and below the line
  },
});
