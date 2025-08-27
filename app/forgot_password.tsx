import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';
import { getAuth, sendPasswordResetEmail } from "@react-native-firebase/auth";
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const isValidEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleResetPassword = async () => {
        if (!isValidEmail(email)) {
            setMessage('Please enter a valid email address.');
            setIsError(true);
            return;
        }

        setLoading(true);
        setMessage('');
        setIsError(false);

        try {
            const auth = getAuth();
            await sendPasswordResetEmail(auth, email);
            Alert.alert('Success', 'Password reset email sent! Check your inbox.');
        } catch (error:any) {
            let errorMessage = 'Failed to send password reset email.';
            // Handle specific Firebase errors for better user feedback
            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage = 'The email address is not valid.';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'There is no user corresponding to this email address.';
                    break;
                default:
                    errorMessage = `${errorMessage}: ${error.message}`;
                    break;
            }
            Alert.alert('Error', errorMessage);
            console.error(error);
        } finally {
            setLoading(false);
            router.push('/');
        }

    };

    return (
        <ThemedSafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerTitle}>Forgot Password</Text>
                    </View>

                    <View style={styles.formSection}>
                        <Text style={styles.instructions}>
                            Enter your email address and we'll send you a link to reset your password.
                        </Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Email Address</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="you@example.com"
                                placeholderTextColor="#9ca3af"
                                onChangeText={setEmail}
                                value={email}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        {message ? (
                            <View style={[styles.messageBox, isError ? styles.errorBox : styles.successBox]}>
                                <Text style={isError ? styles.errorMessageText : styles.successMessageText}>{message}</Text>
                            </View>
                        ) : null}

                        <TouchableOpacity
                            style={[styles.createButton, loading && styles.disabledButton]}
                            onPress={handleResetPassword}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#ffffff" />
                            ) : (
                                <Text style={styles.createButtonText}>Send Reset Link</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.backToLoginContainer}>
                            <Text style={styles.backToLoginText}>Remember your password? </Text>
                            <TouchableOpacity onPress={() => { router.push('/') }}>
                                <Text style={styles.loginLink}>Log in</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ThemedSafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    scrollViewContent: {
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingVertical: 16,
        justifyContent: 'center',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        left: 0,
        padding: 8,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#374151',
        textAlign: 'center',
    },
    formSection: {
        backgroundColor: 'white',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        padding: 20,
        marginBottom: 24,
    },
    instructions: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 24,
    },
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
    },
    messageBox: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    successBox: {
        backgroundColor: '#dcfce7',
    },
    errorBox: {
        backgroundColor: '#fee2e2',
    },
    successMessageText: {
        color: '#15803d',
        textAlign: 'center',
    },
    errorMessageText: {
        color: '#b91c1c',
        textAlign: 'center',
    },
    createButton: {
        backgroundColor: '#4f46e5',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    disabledButton: {
        backgroundColor: '#a5b4fc',
    },
    createButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
    },
    backToLoginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    backToLoginText: {
        color: '#6b7280',
        fontSize: 14,
    },
    loginLink: {
        color: '#4f46e5',
        fontWeight: '600',
        fontSize: 14,
    },
});
