import { StyleSheet, TouchableOpacity, type TouchableOpacityProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ListViewProps = TouchableOpacityProps & {
    lightColor?: string;
    darkColor?: string;
    margin?: number;
    width?: number | `${number}%`;
    height?: number | `${number}%`;
};

export function ThemedTouchableOpacity(
    { margin = 0,width,height, lightColor, darkColor, ...otherProps }: ListViewProps) {
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

    return (
        <TouchableOpacity
            style={[{ backgroundColor, margin,width,height},styles.block]}
            {...otherProps}
        />
    );
}

const styles = StyleSheet.create({
    block: {
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20,
        alignItems: 'flex-start',
        borderRadius: 10,
        backgroundColor: '#f9f9f9cd',
    },
})