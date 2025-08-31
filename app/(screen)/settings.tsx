import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Reusable Settings Item Component ---
const SettingsItem = ({ label, children, isLastItem }: any) => {
    return (
        <View style={[styles.item, isLastItem && styles.lastItem]}>
            <Text style={styles.itemLabel}>{label}</Text>
            <View style={styles.itemRightContent}>
                {children}
            </View>
        </View>
    );
};

// --- Main Settings Screen Component ---
export default function App() {

    const { t, i18n } = useTranslation();

    const [isDarkTheme, setIsDarkTheme] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [journalReminders, setJournalReminders] = useState(false);
    const [taskUpdates, setTaskUpdates] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [dataSharing, setDataSharing] = useState(false);


    // Function to toggle the theme
    const toggleTheme = () => setIsDarkTheme(previousState => !previousState);

    // Set up dynamic styles based on theme
    const themeStyles = isDarkTheme ? darkStyles : lightStyles;
    const combinedStyles = {
        container: { ...styles.container, ...themeStyles.container },
        headerText: { ...styles.headerText, ...themeStyles.headerText },
        card: { ...styles.card, ...themeStyles.card },
        sectionTitle: { ...styles.sectionTitle, ...themeStyles.sectionTitle },
        separator: { ...styles.separator, ...themeStyles.separator },
        linkText: { ...styles.linkText, ...themeStyles.linkText },
        deleteButtonText: { ...styles.deleteButtonText, ...themeStyles.deleteButtonText },
    };

    return (
        <SafeAreaView style={combinedStyles.container}>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.push('/(tabs)/home')}>
                    <FontAwesome name="arrow-left" size={24} color="#6b7280" />
                </TouchableOpacity>
                    <Text style={combinedStyles.headerText}>{t('settings.settings')}</Text>
                </View>

                <View style={combinedStyles.card}>
                    <View style={styles.section}>
                        <Text style={combinedStyles.sectionTitle}>{t('settings.account')}</Text>
                        <SettingsItem label={t('settings.theme')}>
                            <Switch
                                ios_backgroundColor={isDarkTheme ? '#4f46e5' : '#ccc'}
                                onValueChange={toggleTheme}
                                value={isDarkTheme}
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
                                <Text style={combinedStyles.deleteButtonText}>{t('settings.delete')}</Text>
                            </TouchableOpacity>
                        </SettingsItem>
                    </View>

                    <View style={combinedStyles.separator} />

                    <View style={styles.section}>
                        <Text style={combinedStyles.sectionTitle}>{t('settings.privacy')}</Text>
                        {/* <SettingsItem label="Data Sharing">
                            <Switch
                                ios_backgroundColor={dataSharing ? '#4f46e5' : '#ccc'}
                                onValueChange={setDataSharing}
                                value={dataSharing}
                            />
                        </SettingsItem> */}
                        <SettingsItem label={t('settings.view_privacy_policy')} isLastItem>
                            <TouchableOpacity onPress={() => console.log('View Privacy Policy pressed')}>
                                <Text style={combinedStyles.linkText}>{t('settings.view')}</Text>
                            </TouchableOpacity>
                        </SettingsItem>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>

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

// --- Theme-specific styles ---
const lightStyles = StyleSheet.create({
    container: {
        backgroundColor: '#f3f4f6',
    },
    headerText: {
        color: '#1f2937',
    },
    card: {
        backgroundColor: '#ffffff',
    },
    sectionTitle: {
        color: '#1f2937',
    },
    linkText: {
        color: '#4f46e5',
    },
    deleteButtonText: {
        color: '#ef4444',
    },
    separator: {
        backgroundColor: '#e5e7eb',
    },
    backButton: {
        padding: 8,
    }
});

const darkStyles = StyleSheet.create({
    container: {
        backgroundColor: '#1a202c',
    },
    headerText: {
        color: '#cbd5e0',
    },
    card: {
        backgroundColor: '#2d3748',
    },
    sectionTitle: {
        color: '#cbd5e0',
    },
    linkText: {
        color: '#9f7aea',
    },
    deleteButtonText: {
        color: '#f87171',
    },
    separator: {
        backgroundColor: '#4a5568',
    },
    backButton: {
        padding: 8,
    }
});
