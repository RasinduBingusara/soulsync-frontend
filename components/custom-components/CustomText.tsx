import React from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'

interface CustomTextInputProps {
    value: string;
    setValue: (text: string) => void;
    label: string;
    placeholder: string;
    type?: 'default' | 'area';
}

export function CustomTextInput({ value, setValue, label, placeholder, type }: CustomTextInputProps) {
    return (
        <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{label}</Text>
            {
                type === 'default' ? (
                    <TextInput
                        style={styles.textInput}
                        placeholder={placeholder}
                        placeholderTextColor="#9ca3af"
                        onChangeText={setValue}
                        value={value}
                    />
                ) : type === 'area' ? (
                    <TextInput
                        style={[styles.textInput, { height: 100, textAlignVertical: 'top' }]}
                        placeholder={placeholder}
                        placeholderTextColor="#9ca3af"
                        multiline={true}
                        numberOfLines={4}
                        onChangeText={setValue}
                        value={value}
                    />
                ) : null
            }
        </View>
    )
}

const styles = StyleSheet.create({
    inputGroup: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 12,
        color: '#6b7280',
        position: 'absolute',
        top: -8,
        left: 12,
        backgroundColor: 'white',
        paddingHorizontal: 4,
        zIndex: 1,
    },
    textInput: {
        height: 48,
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 14,
        color: '#1f2937',
    }
})

