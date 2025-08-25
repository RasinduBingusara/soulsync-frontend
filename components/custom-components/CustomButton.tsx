import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

interface CustomButtonProps {
    onPress: () => void;
    text:string,
    backgroundColor?:string,
    color?:string
    pressable?:boolean
    fontSize?:number
}

export function CustomButton({onPress,text,backgroundColor='#4f46e5',color='#fff',pressable=true,fontSize}:CustomButtonProps) {
    return (
        <TouchableOpacity style={[styles.createButton,{backgroundColor},!pressable && ({backgroundColor:'#8a8a8aff'})]} onPress={onPress} disabled={!pressable}>
            <Text style={[styles.createButtonText,{color,fontSize}]}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    createButton: {
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    createButtonText: {
        fontSize: 18,
        fontWeight: '700',
    }
})

