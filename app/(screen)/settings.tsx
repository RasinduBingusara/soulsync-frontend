import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Reusable Settings Item Component ---
const SettingsItem = ({ label, children, isLastItem }: any) => {
    return (
        <View style={[styles.item, isLastItem && styles.lastItem]}>
            <ThemedText style={styles.itemLabel}>{label}</ThemedText>
            <View style={styles.itemRightContent}>
                {children}
            </View>
        </View>
    );
};

export default function App() {

    const { t, i18n } = useTranslation();
    const systemTheme = useColorScheme();
    const [theme, setTheme] = useState(systemTheme === 'dark' ? DarkTheme : DefaultTheme);
    const [emailNotifications, setEmailNotifications] = useState(true);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === DefaultTheme ? DarkTheme : DefaultTheme);
        console.log('theme:',theme)
    };

    return (
        <ThemedSafeAreaView style={styles.container} darkColor='#000000ff'>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <ThemedView style={styles.header} backgroundVisible={false}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.push('/(tabs)/home')}>
                        <FontAwesome name="arrow-left" size={24} color="#6b7280" />
                    </TouchableOpacity>
                    <ThemedText style={styles.headerText}>{t('settings.settings')}</ThemedText>
                </ThemedView>

                <ThemedView style={styles.card}>
                    <ThemedView style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>{t('settings.account')}</ThemedText>
                        <SettingsItem label={t('settings.theme')}>
                            <Switch
                                ios_backgroundColor={theme ? '#4f46e5' : '#ccc'}
                                onValueChange={toggleTheme}
                                value={theme.dark}
                            />
                        </SettingsItem>
                        <SettingsItem label={t('settings.email_notifications')}>
                            <Switch
                                ios_backgroundColor={emailNotifications ? '#4f46e5' : '#ccc'}
                                onValueChange={setEmailNotifications}
                                value={emailNotifications}
                            />
                        </SettingsItem>
                        <SettingsItem label={t('settings.delete_account')} isLastItem>
                            <TouchableOpacity onPress={() => console.log('Delete Account pressed')}>
                                <ThemedText style={styles.deleteButtonText}>{t('settings.delete')}</ThemedText>
                            </TouchableOpacity>
                        </SettingsItem>
                    </ThemedView>

                    <View style={styles.separator} />

                    <ThemedView style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>{t('settings.privacy')}</ThemedText>
                        {/* <SettingsItem label="Data Sharing">
                            <Switch
                                ios_backgroundColor={dataSharing ? '#4f46e5' : '#ccc'}
                                onValueChange={setDataSharing}
                                value={dataSharing}
                            />
                        </SettingsItem> */}
                        <SettingsItem label={t('settings.view_privacy_policy')} isLastItem>
                            <TouchableOpacity onPress={() => console.log('View Privacy Policy pressed')}>
                                <ThemedText style={styles.linkText}>{t('settings.view')}</ThemedText>
                            </TouchableOpacity>
                        </SettingsItem>
                    </ThemedView>
                </ThemedView>
            </ScrollView>
        </ThemedSafeAreaView>

    );
}

// --- Stylesheet for Components ---
const styles = StyleSheet.create({
    container: {
        padding: 16,
        fontFamily: 'System',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingBottom: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 16,
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    card: {
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        padding: 24,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    lastItem: {
        borderBottomWidth: 0,
    },
    itemLabel: {
        fontSize: 16,
        color: '#4b5563',
    },
    itemRightContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    linkText: {
        fontSize: 14,
        fontWeight: '600',
    },
    deleteButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    separator: {
        height: 1,
        backgroundColor: '#e5e7eb',
        marginVertical: 16,
    },
    backButton: {
        padding: 8,
    }
});