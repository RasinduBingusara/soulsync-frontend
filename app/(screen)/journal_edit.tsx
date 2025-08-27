import { FontAwesome } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from 'react-native';

import { PredictMood } from '@/components/custom-function/MoodPredictor';
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedLabel } from '@/components/ThemedLabel';
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from "@react-native-firebase/auth";
import { getFirestore } from '@react-native-firebase/firestore';



//database attribute names here
interface IJournalData {
    uid: string,
    content: string,
    createAt: string,
    mood: string
}


export default function JournalEdit() {

    const [lastJournals, setLastJournals] = useState<IJournalData[]>([]);
    const [loading, setLoading] = useState(false);
    const [updatedContent, setUpdatedContent] = useState('');
    const [updatedmood, setUpdatedMood] = useState('happy');

    const {id,timestamp, mood, content} = useLocalSearchParams();

    const db = getFirestore();
    const user = getAuth().currentUser;

    // const updateJournal = async () => {

    //     if (!content) {
    //         Alert.alert('No content to update');
    //         return;
    //     }
    //     setLoading(true);
    //     try {
    //         const timestamp = new Date().toISOString();
    //         const docRef = await doc(db, 'Journals',id.toString());
            
    //         await updateDoc(docRef, {
    //             mood:updatedmood,
    //             content:updatedContent,
    //             createAt:timestamp
    //         })
    //         console.log('Post created with ID: ', docRef.id);

    //     }
    //     catch (e) {
    //         console.log('Error saving journal: ', e)
    //     }
    //     finally {
    //         setUpdatedContent('');
    //         setUpdatedMood('');
    //         setLoading(false);
    //         router.push('/(tabs)/journal-list')
    //     }
    // }

    const updateJournal = async () => {

        if (!content) {
            Alert.alert('No content to update');
            return;
        }
        setLoading(true);
        try {
            const mood = await PredictMood(updatedContent);

            const timestamp = new Date().toISOString();
            const journalKey = id.toString();
            const existingJournals = await AsyncStorage.getItem('Journals');
            let journals = existingJournals ? JSON.parse(existingJournals) : [];
            journals = journals.map((journal: any) =>
                journal.id === id
                    ? {
                        ...journal,
                        content: updatedContent,
                        mood: mood,
                        createAt: timestamp,
                    }
                    : journal
            );
            await AsyncStorage.setItem('Journals', JSON.stringify(journals));
            const docRef = { id: id.toString() };
            console.log('Post created with ID: ', docRef.id);

        }
        catch (e) {
            console.log('Error saving journal: ', e)
        }
        finally {
            setUpdatedContent('');
            setUpdatedMood('');
            setLoading(false);
            router.push('/(tabs)/journal-list')
        }
    }

    useEffect(() => {
        setUpdatedContent(content.toString());
        setUpdatedMood(mood.toString());
    }, [id,timestamp, mood, content])



    return (
        <ThemedSafeAreaView style={styles.safeArea}>

            <ThemedView style={styles.headerContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => { router.push('..') }}>
                    <FontAwesome name="arrow-left" size={24} color="#6b7280" />
                </TouchableOpacity>
                <ThemedText style={styles.headerTitle}>Update Daily Journal</ThemedText>
            </ThemedView>

            <ThemedView style={styles.contentContainer}>

                <ThemedView style={styles.formSection}>
                    <ThemedText style={styles.formTitle}>How are you feeling now?</ThemedText>

                    {/* The Write Your Entry Section */}
                    <ThemedView style={styles.inputGroupContainer}>
                        <ThemedLabel style={styles.inputLabel}>Rewrite your entry</ThemedLabel>
                        <ThemedInput
                            style={styles.textArea}
                            placeholder="Share your thoughts..."
                            placeholderTextColor="#9ca3af"
                            multiline={true}
                            numberOfLines={5}
                            textAlignVertical="top"
                            value={updatedContent}
                            onChangeText={(value) => setUpdatedContent(value)}
                        />
                    </ThemedView>

                    {/* The Emotion Section */}
                    <ThemedView style={styles.inputGroupContainer}>
                        <ThemedLabel style={styles.inputLabel}>Emotion</ThemedLabel>
                        <ThemedInput
                            style={styles.textInput}
                            placeholder="..."
                            placeholderTextColor="#9ca3af"
                            editable={false}
                            value={updatedmood}
                        />
                    </ThemedView>
                    {
                        loading ? (
                            <ActivityIndicator size={'small'} />
                        ) :
                            (
                                <TouchableOpacity style={styles.saveButton} onPress={updateJournal}>
                                    <ThemedText style={styles.saveButtonText}>Update Entry</ThemedText>
                                </TouchableOpacity>
                            )
                    }

                </ThemedView>
            </ThemedView>


        </ThemedSafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        marginLeft: 16,
        color: '#374151',
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
    },
    inputGroupContainer: {
        paddingTop: 10,
        marginBottom: 16,
        position: 'relative',
    },
    inputLabel: {
        fontSize: 12,
        color: '#6b7280',
        position: 'absolute',
        top: 0,
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
        paddingTop: 8,
        fontSize: 14,
    },
    textArea: {
        height: 200,
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingTop: 12,
        fontSize: 14,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        color: '#374151',
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputGroup: {
        flex: 1,
    },
    saveButton: {
        backgroundColor: '#4f46e5',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
    previousEntriesSection: {
        flex: 1,
        marginHorizontal:20
    },
    previousEntriesTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    entriesList: {
        gap: 16,
        paddingBottom: 40
    },
    noEntry: {
        fontSize: 14,
        color: '#374151',
    }
});
