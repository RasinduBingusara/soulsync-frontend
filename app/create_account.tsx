import { ThemedInput } from '@/components/ThemedInput';
import { ThemedText } from '@/components/ThemedText';
import '@/components/translation/i18n';
import { createUserWithEmailAndPassword, getAuth, updateProfile } from "@react-native-firebase/auth";
import { router } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';


const CreateAccountScreen = () => {
    const { t } = useTranslation();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const auth = getAuth();

    const handleCreateAccount = async () => {
        
        if (password !== confirmPassword) {
            Alert.alert('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            Alert.alert("Password is too short. Must be at least 8 characters.");
            return false;
        }

        // 2. Check for at least one uppercase letter
        if (!/[A-Z]/.test(password)) {
            Alert.alert("Password must contain at least one uppercase letter.");
            return false;
        }

        // 3. Check for at least one lowercase letter
        if (!/[a-z]/.test(password)) {
            Alert.alert("Password must contain at least one lowercase letter.");
            return false;
        }

        // 4. Check for at least one number
        if (!/[0-9]/.test(password)) {
            Alert.alert("Password must contain at least one number.");
            return false;
        }

        // 5. Check for at least one special character
        if (!/[^A-Za-z0-9]/.test(password)) {
            Alert.alert("Password must contain at least one special character.");
            return false;
        }

        if (!username || !email || !password || !confirmPassword) {
            Alert.alert('All fields required');
            return;
        }

        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, { displayName: username });

            console.log("User created successfully:", user.uid);
            console.log("User's Display Name:", user.displayName);

            Alert.alert('Success', 'Account created successfully!');
            router.push('/');

        } catch (error: any) {
            // Handle specific Firebase Auth errors
            let errorMessage = "Registration failed. Please try again.";
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = "This email is already in use. Please sign in or use a different email.";
                    break;
                case 'auth/invalid-email':
                    errorMessage = "The email address is not valid.";
                    break;
                case 'auth/weak-password':
                    errorMessage = "The password is too weak. Please use a stronger password.";
                    break;
                default:
                    errorMessage = `Registration failed: ${error.message}`;
                    break;
            }
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
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
