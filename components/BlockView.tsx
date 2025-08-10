import { StyleSheet, View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type BlockedViewProps = ViewProps & {
    lightColor?: string;
    darkColor?: string;
    margin?: number;
    flexDirection?: 'column' | 'row' | 'row-reverse' | 'column-reverse';
    gap?: number;
    width?: number | `${number}%`;
    shadow?: 'True' | 'False';
    alignCenter?: 'True' | 'False';
    height?: number | `${number}%`;
};

export function BlockedView(
    { margin = 0, flexDirection = 'column', gap = 0, width,height,shadow='True',alignCenter='True', lightColor, darkColor, ...otherProps }: BlockedViewProps) {
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

    return <View style={[{ backgroundColor, margin, flexDirection, gap, width,height }
        , styles.block, shadow == 'True'? styles.blockShadow:'',alignCenter=='True'?styles.alignCenter:'' ]} {...otherProps} />;
}

const styles = StyleSheet.create({
    block: {
        padding: 20,
        borderRadius: 10,
    },
    blockShadow:{
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 3,
    },
    alignCenter: {
        alignItems: 'center',
    }
})