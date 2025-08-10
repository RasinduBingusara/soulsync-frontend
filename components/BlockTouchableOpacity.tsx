import { Image, StyleSheet, TouchableOpacity, View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type BlockedViewProps = ViewProps & {
    lightColor?: string;
    darkColor?: string;
    margin?: number;
    flexDirection?: 'column' | 'row' | 'row-reverse' | 'column-reverse';
    gap?: number;
    width?: number | `${number}%`;
    shadow?: 'True' | 'False';
    icon?: number;
    iconSize?: number;
};

export function BlockTouchableOpacity(
    { margin = 0, flexDirection = 'column', gap = 0, 
        width, shadow = 'True', icon = require('@/assets/images/react-logo.png'), iconSize=30,
         lightColor, darkColor, ...otherProps }: BlockedViewProps) {
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

    return (
        <TouchableOpacity
            style={[
                { backgroundColor, margin, flexDirection, gap, width },
                styles.block,
                shadow == 'True' ? styles.blockShadow : null
            ]}
            {...otherProps}
        >
            <Image source={icon} style={{ width: iconSize, height: iconSize }} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    block: {
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    blockShadow:{
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
    }
})