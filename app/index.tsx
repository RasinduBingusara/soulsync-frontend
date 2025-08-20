import { ThemedText } from '@/components/ThemedText'
import { useState } from 'react'
import { TextInput, View, Button, ActivityIndicator, KeyboardAvoidingView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,updateProfile} from "@react-native-firebase/auth"
import { FirebaseError } from 'firebase/app'

export default function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = getAuth();

    const SignUp = async () => {
        console.log(displayName);
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth,email, password);
            const user = userCredential.user;

            await updateProfile(user,{displayName: displayName});
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
            await signInWithEmailAndPassword(auth,email, password);
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
        <SafeAreaView style={{ backgroundColor: "#2c7affff", justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <KeyboardAvoidingView behavior='padding' style={{ justifyContent: 'center', alignItems: 'center', }}>
                <View style={{ flexDirection: 'row', padding: 20 }}>

                    <TextInput
                        style={{ width: '80%', borderStyle: 'solid', borderWidth: 1,  paddingHorizontal: 10 }}
                        placeholder="Email"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={(value) => setEmail(value)}
                    />
                </View>

                <View style={{ flexDirection: 'row', padding: 20 }}>
                    <TextInput
                        style={{ width: '80%', borderStyle: 'solid', borderWidth: 1, paddingHorizontal: 10, color:'#fff' }}
                        placeholder="Password"
                        keyboardType="default"
                        secureTextEntry={true}
                        value={password}
                        onChangeText={(value) => setPassword(value)}
                    />
                </View>

                <View style={{ flexDirection: 'row', padding: 20 }}>

                    <TextInput
                        style={{ width: '80%', borderStyle: 'solid', borderWidth: 1,  paddingHorizontal: 10 }}
                        placeholder="Display name"
                        keyboardType="default"
                        value={displayName}
                        onChangeText={(value) => setDisplayName(value)}
                    />
                </View>
                {
                    loading ? (
                        <ActivityIndicator size={'small'} color={'#fff'} style={{ margin: 28 }} />
                    ) : (
                        <View style={{ gap: 20 }}>
                            <Button title='Login' onPress={SignIn}/>
                            <Button title='Create Account' onPress={SignUp} />
                        </View>

                    )
                }
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
