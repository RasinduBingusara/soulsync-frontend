import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { JournalEntry } from '@/components/JournalEntry';
import { getAuth } from "@react-native-firebase/auth";
import { addDoc, collection, getDocs, getFirestore, limit, orderBy, query, where } from '@react-native-firebase/firestore';



//database attribute names here
interface IJournalData {
    uid: string,
    content: string,
    createAt: string,
    mood: string
}


export default function JournalCreate() {

    const [lastJournals, setLastJournals] = useState<IJournalData[]>([]);
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState('');
    const [mood, setMood] = useState('happy');

    const db = getFirestore();
    const user = getAuth().currentUser;

    const getLastJournals = async (count: number) => {

        setLoading(true);
        const lastJournals: IJournalData[] = [];
        try {
            const journalsRef = collection(db, "Journals");
            const q = query(
                journalsRef,
                where("uid", "==", user?.uid),
                orderBy("createAt", "desc"),
                limit(count)
            );

            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc: any) => {
                lastJournals.push(doc.data());
            });

        }
        catch (error) {
            console.error("Failed to load tasks:", error);
        }
        finally {
            setLastJournals(lastJournals);
            setLoading(false);
        }
    }

    const saveJournal = async () => {

        if (!content) {
            Alert.alert('No content to save');
            return;
        }
        setLoading(true);
        try {
            const timestamp = new Date().toISOString();
            const docRef = await addDoc(collection(db, 'Journals'), {
                uid: user?.uid,
                createAt: timestamp,
                content: content,
                mood: mood,
            })
            console.log('Post created with ID: ', docRef.id);

        }
        catch (e) {
            console.log('Error saving journal: ', e)
        }
        finally {
            setContent('');
            setMood('');
            setLoading(false);
            router.push('/(tabs)/journal-list')
        }
    }



    useEffect(() => {
        getLastJournals(5);
    }, [])


    return (
        <SafeAreaView style={styles.safeArea}>

            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => { router.push('..') }}>
                    <FontAwesome name="arrow-left" size={24} color="#6b7280" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Daily Journal</Text>
            </View>

            <View style={styles.contentContainer}>

                <View style={styles.formSection}>
                    <Text style={styles.formTitle}>How are you feeling today?</Text>

                    {/* The Write Your Entry Section */}
                    <View style={styles.inputGroupContainer}>
                        <Text style={styles.inputLabel}>Write your entry</Text>
                        <TextInput
                            style={styles.textArea}
                            placeholder="Share your thoughts..."
                            placeholderTextColor="#9ca3af"
                            multiline={true}
                            numberOfLines={5}
                            textAlignVertical="top"
                            value={content}
                            onChangeText={(value) => setContent(value)}
                        />
                    </View>

                    {/* The Emotion Section */}
                    <View style={styles.inputGroupContainer}>
                        <Text style={styles.inputLabel}>Emotion</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="..."
                            placeholderTextColor="#9ca3af"
                            editable={false}
                        />
                    </View>
                    {
                        loading ? (
                            <ActivityIndicator size={'small'} />
                        ) :
                            (
                                <TouchableOpacity style={styles.saveButton} onPress={saveJournal}>
                                    <Text style={styles.saveButtonText}>Save Entry</Text>
                                </TouchableOpacity>
                            )
                    }

                </View>
            </View>

            <View style={styles.previousEntriesSection}>
                <Text style={styles.previousEntriesTitle}>Previous Entries</Text>
                <View style={styles.entriesList}>
                    {lastJournals[0] ? (
                        <FlatList
                            data={lastJournals}
                            renderItem={({ item }) => <JournalEntry
                                timestamp={item.createAt}
                                content={item.content}
                                mood={item.mood}
                                moreOption={false}
                            />}
                            contentContainerStyle={styles.entriesList}
                        />
                    ) :
                        (
                            <Text style={styles.noEntry}>No journals yet</Text>
                        )
                    }

                </View>
            </View>



        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f3f4f6',
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
        color: '#1f2937',
    },
    textArea: {
        height: 200,
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingTop: 12,
        fontSize: 14,
        color: '#1f2937',
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
