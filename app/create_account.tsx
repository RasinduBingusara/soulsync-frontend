import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { useTranslation } from 'react-i18next';
import '@/components/translation/i18n';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';


const CreateAccountScreen = () => {
    const { t } = useTranslation();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // This is a placeholder function for the create account logic
    const handleCreateAccount = () => {
        // Add your account creation logic and validation here
        console.log('Attempting to create account with:', { username, email });
        if (password !== confirmPassword) {
            console.error('Passwords do not match!');
            return;
        }

    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.container}>
                        {/* Header */}
                        <View style={styles.header}>
                            <ThemedText style={styles.headerTitle}>{t('create_account.title')}</ThemedText>
                            <ThemedText style={styles.headerSubtitle}>{t('create_account.subtitle')}</ThemedText>
                        </View>

                        {/* Form */}
                        <View style={styles.form}>
                            <View style={styles.inputGroup}>
                                <ThemedText style={styles.label}>{t('create_account.username')}</ThemedText>
                                <ThemedInput
                                    style={styles.input}
                                    onChangeText={setUsername}
                                    value={username}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    placeholder={t('create_account.username_placeholder')}
                                    placeholderTextColor="#9ca3af"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <ThemedText style={styles.label}>{t('create_account.email_address')}</ThemedText>
                                <ThemedInput
                                    style={styles.input}
                                    onChangeText={setEmail}
                                    value={email}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    placeholder={t('create_account.email_placeholder')}
                                    placeholderTextColor="#9ca3af"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <ThemedText style={styles.label}>{t('create_account.password')}</ThemedText>
                                <ThemedInput
                                    style={styles.input}
                                    onChangeText={setPassword}
                                    value={password}
                                    secureTextEntry
                                    placeholder={t('create_account.password_placeholder')}
                                    placeholderTextColor="#9ca3af"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <ThemedText style={styles.label}>{t('create_account.confirm_password')}</ThemedText>
                                <ThemedInput
                                    style={styles.input}
                                    onChangeText={setConfirmPassword}
                                    value={confirmPassword}
                                    secureTextEntry
                                    placeholder="********"
                                    placeholderTextColor="#9ca3af"
                                />
                            </View>

                            <View style={styles.createAccountButtonContainer}>
                                <TouchableOpacity style={styles.createAccountButton} onPress={handleCreateAccount}>
                                    <ThemedText style={styles.createAccountButtonText}>{t('create_account.create_account_button')}</ThemedText>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Sign In Link */}
                        <View style={styles.signInLinkContainer}>
                            <ThemedText style={styles.signInLinkText}>
                                {t('create_account.already_have_account')}
                            </ThemedText>
                            <TouchableOpacity onPress={() => { router.push('/') }}>
                                <ThemedText style={styles.signInLink}>{t('create_account.sign_in')}</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    container: {
        width: '100%',
        maxWidth: 400,
        padding: 32,
        alignSelf: 'center',
        marginTop: 50,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        marginTop: 4,
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 4,
    },
    input: {
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#d1d5da',
        borderRadius: 12,
        fontSize: 16,
    },
    createAccountButtonContainer: {
        alignItems: 'center',
        marginTop: 8,
    },
    createAccountButton: {
        width: '100%',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: '#4f46e5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    createAccountButtonText: {
        fontWeight: '600',
        fontSize: 16,
    },
    signInLinkContainer: {
        flexDirection: 'row',
        marginTop: 24,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    signInLinkText: {
        fontSize: 14,
    },
    signInLink: {
        fontWeight: '500',
        color: '#4f46e5',
    },
});

export default CreateAccountScreen;
