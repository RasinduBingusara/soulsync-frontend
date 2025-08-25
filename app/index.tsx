import { ThemedText } from '@/components/ThemedText'
import { useEffect, useState } from 'react'
import { TextInput, View, Button, ActivityIndicator, KeyboardAvoidingView, StyleSheet, Platform, Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "@react-native-firebase/auth"
import { FirebaseError } from 'firebase/app'
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';

export default function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [loading, setLoading] = useState(false);

    const auth = getAuth();

    useEffect(() => {

        GoogleSignin.configure({
            webClientId: '594698061963-hbtftklfo4i2eqbqjl4h68ie2nrkikni.apps.googleusercontent.com',
            offlineAccess: true,
            scopes: ['profile', 'email'],
        });
    }, []);

    const SignInWithGoogleAuthentication = async () => {
        setLoading(true);

        try {
            await GoogleSignin.hasPlayServices();
            const signInResponse = await GoogleSignin.signIn();

            const idToken = signInResponse.data?.idToken;

            if (!idToken) {
                console.log('ID Token is missing from the sign-in response.');
                return;
            }

            const googleCredential = GoogleAuthProvider.credential(idToken);


            const userCredential = await auth.signInWithCredential(googleCredential);

            console.log('User signed in with Google:', userCredential.user.displayName);

        } catch (error: any) {
            console.error('Google Sign-In Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const SignUp = async () => {
        console.log(displayName);
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, { displayName: displayName });
            console.log("User's Display Name:", user.displayName);
            alert('Check your emails!')
        }
        catch (error) {
            const err = error as FirebaseError;
            alert('Registration failed: ' + err.message);
        }
        finally {
            setLoading(false);
        }
    }

    const SignIn = async () => {
        setLoading(true);
        try {
            console.log('email: ', email);
            console.log('password: ', password);
            await signInWithEmailAndPassword(auth, email, password);
            alert('Check your emails!')
        }
        catch (error) {
            const err = error as FirebaseError;
            alert('Sign in failed: ' + err.message);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Welcome Back</Text>
                        <Text style={styles.headerSubtitle}>Sign in to your account</Text>
                    </View>

                    <View style={styles.socialLoginContainer}>
                        <TouchableOpacity style={styles.googleButton} onPress={() => SignInWithGoogleAuthentication()} disabled={loading}>
                            <FontAwesome name="google" size={24} color="black" style={styles.googleButtonIcon} />
                            <Text style={styles.googleButtonText}>Sign in with Google</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.dividerContainer}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>Or continue with</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Email & Password Form */}
                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email address</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={setEmail}
                                value={email}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="you@example.com"
                                placeholderTextColor="#9ca3af"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={setPassword}
                                value={password}
                                secureTextEntry
                                placeholder="••••••••"
                                placeholderTextColor="#9ca3af"
                            />
                        </View>

                        <View style={styles.forgotPasswordContainer}>
                            <TouchableOpacity>
                                <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.signInButtonContainer}>
                            <TouchableOpacity style={styles.signInButton} onPress={SignIn} disabled={loading}>
                                <Text style={styles.signInButtonText}>Sign in</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.signInLinkContainer}>
                            <Text style={styles.signInLinkText}>
                                Don't have an account?
                            </Text>
                            <TouchableOpacity onPress={() => { router.push('/create_account') }}>
                                <Text style={styles.signInLink}>Create account</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffffff',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    container: {
        flex: 1,
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#ffffffff',
        padding: 32,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    headerSubtitle: {
        color: '#6b7280',
        marginTop: 4,
    },
    socialLoginContainer: {
        marginBottom: 24,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#d1d5da',
        borderRadius: 9999,
        backgroundColor: '#fff',
    },
    googleButtonIcon: {
        color: '#4285f4', // A simple representation of the Google G icon color
        marginRight: 8,
    },
    googleButtonText: {
        color: '#374151',
        fontWeight: '500',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#d1d5da',
    },
    dividerText: {
        marginHorizontal: 8,
        color: '#6b7280',
        fontSize: 14,
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
        color: '#374151',
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
        color: '#1f2937',
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        fontSize: 14,
        color: '#4f46e5',
        fontWeight: '500',
    },
    signInButtonContainer: {
        alignItems: 'center',
    },
    signInButton: {
        width: '100%',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: '#4f46e5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    signInButtonText: {
        color: '#fff',
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
        color: '#6b7280',
    },
    signInLink: {
        fontWeight: '500',
        color: '#4f46e5',
    },
});

