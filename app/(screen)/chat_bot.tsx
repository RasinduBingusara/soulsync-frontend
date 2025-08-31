import { ThemedInput } from '@/components/ThemedInput';
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from '@react-native-firebase/auth';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
const ChatbotScreen = () => {
    const { t, i18n } = useTranslation();
    const [userInput, setUserInput] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const scrollViewRef = useRef<ScrollView | null>(null);
    const auth = getAuth();
    const CHAT_KEY = `@chat_messages:${auth.currentUser?.uid}`;

    // Function to add a new message to the state
    const addMessage = (text: string, sender: string) => {
        setMessages(prevMessages => {
            const newMessages = [...prevMessages, { text, sender }];
            saveMessages(newMessages); // Save messages after updating the state
            return newMessages;
        });
    };

    const checkBotMessageUpdate = async () => {
        try {
            console.log('Checking for bot message update based on today\'s mood...');
            const today = new Date().toISOString().slice(0, 10);
            const uid = auth.currentUser?.uid || '';
            const stored = await AsyncStorage.getItem('DailyMoods');
            let moods = stored ? JSON.parse(stored) : [];
            const index = moods.findIndex((item: any) => item.date === today && item.uid === uid);
            if (index !== -1) {
                console.log('Today\'s mood entry index:', index);
                console.log('Updating bot message based on today\'s mood:', moods[index].mood);
                    setMessages([{ text: t('chat.how_can_i_help_with_emotion', { mood: moods[index].mood }), sender: 'bot' }]);
            }
            else{
                console.log('No mood entry found for today.');
                setMessages([{ text: t('chat.how_can_i_help'), sender: 'bot' }]);
            }
        }
        catch (e) {
            console.error('Error checking today\'s mood:', e);
        }
    }

    useEffect(() => {
        checkBotMessageUpdate();
        const loadMessages = async () => {
            try {
                const storedMessages = await AsyncStorage.getItem(CHAT_KEY);
                if (storedMessages !== null) {
                    setMessages(JSON.parse(storedMessages));
                }
            } catch (error) {
                console.error('Failed to load messages from AsyncStorage', error);
                // Fallback to a default message on error
                setMessages([{ text: 'Hello! How can I help you today?', sender: 'bot' }]);
            }
        };

        loadMessages();
    }, []); // Empty dependency array ensures this runs only once

    const saveMessages = async (currentMessages: any) => {
        try {
            const jsonValue = JSON.stringify(currentMessages);
            await AsyncStorage.setItem(CHAT_KEY, jsonValue);
        } catch (error) {
            console.error('Failed to save messages to AsyncStorage', error);
        }
    };

    // Handles API calls with exponential backoff
    // Reusable fetch function with exponential backoff (no changes needed here)
    const fetchWithRetry = async (url: any, options: any) => {
        let retries = 0;
        const maxRetries = 5;
        const baseDelay = 1000;

        while (retries < maxRetries) {
            console.log('fetching');
            try {
                console.log('await started: ', url);
                const response = await fetch(url, options);
                console.log(`API returned status: ${response.status}`);

                // Success: If the response is OK, return it immediately.
                if (response.ok) {
                    return response;
                }

                // Retry for a specific status code (e.g., 429 Too Many Requests).
                // This is correctly handled by a deliberate throw.
                if (response.status === 429) {
                    retries++;
                    const delay = baseDelay * Math.pow(2, retries - 1);
                    await new Promise(res => setTimeout(res, delay));
                } else {
                    // For any other status code (like 404, 500, etc.), throw an error
                    // to break the retry loop and go to the outer `catch` block.
                    throw new Error(`API returned status: ${response.status}`);
                }
            } catch (e) {
                // This catches both network errors and thrown HTTP status errors.
                retries++;
                const delay = baseDelay * Math.pow(2, retries - 1);
                await new Promise(res => setTimeout(res, delay));

                // Rethrow the error on the last retry to exit the function.
                if (retries === maxRetries) {
                    throw new Error('Failed to get a response from the API after multiple retries.');
                }
            }
        }
        // Final fallback if the loop completes without a successful response.
        throw new Error('Failed to get a response from the API after multiple retries.');
    };

    // Function to handle the chat logic
    const handleChat = async () => {
        const prompt = userInput.trim();
        if (prompt === '' || isTyping) return;

        // Immediately add the new user message to the local state
        addMessage(prompt, 'user');
        setUserInput('');
        setIsTyping(true);

        try {
            // Transform the entire 'messages' state into the correct API format
            const historyForApi = messages.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: [{ text: msg.text }]
            }));

            // Add the new user message to the history before sending
            const currentHistory = [...historyForApi, {
                role: 'user',
                content: [{ text: prompt }]
            }];

            const payload = { input: currentHistory };
            const apiUrl = 'http://192.168.8.100:8000/chat/';

            const response = await fetchWithRetry(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (result.response) {
                addMessage(result.response, 'bot');
            } else {
                addMessage(
                    "Sorry, I couldn't get a response. Please try again.",
                    'bot'
                );
            }
        } catch (error) {
            console.error('API Error:', error);
            addMessage('An error occurred. Please try again later.', 'bot');
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <ThemedSafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Chatbot Header */}
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <TouchableOpacity style={styles.backButton} onPress={() => { router.push('..') }}>
                            <FontAwesome name="arrow-left" size={24} color="#6b7280" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>{t('chat.title')}</Text>
                    </View>
                </View>

                {/* Messages Area */}
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.messagesContainer}
                    contentContainerStyle={styles.messagesContent}
                >
                    {messages.map((msg, index) => (
                        <View
                            key={index}
                            style={[
                                styles.messageWrapper,
                                msg.sender === 'user'
                                    ? styles.userMessageWrapper
                                    : styles.botMessageWrapper,
                            ]}
                        >
                            <View
                                style={[
                                    styles.messageBubble,
                                    msg.sender === 'user'
                                        ? styles.userMessageBubble
                                        : styles.botMessageBubble,
                                ]}
                            >
                                <Text style={msg.sender === 'user' ? styles.userMessageText : styles.botMessageText}>
                                    {msg.text}
                                </Text>
                            </View>
                        </View>
                    ))}
                    {isTyping && (
                        <View style={styles.typingIndicatorWrapper}>
                            <View style={styles.typingIndicatorBubble}>
                                <Text style={styles.typingIndicatorText}>Typing...</Text>
                            </View>
                        </View>
                    )}
                </ScrollView>

                <ThemedView style={styles.inputContainer}>
                    <ThemedInput
                        style={styles.textInput}
                        placeholder={t('chat.placeholder')}
                        value={userInput}
                        onChangeText={setUserInput}
                        onSubmitEditing={handleChat}
                        blurOnSubmit={false}
                    />
                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={handleChat}
                        disabled={isTyping}
                    >
                        <Text style={styles.sendButtonText}>➔</Text>
                    </TouchableOpacity>
                </ThemedView>
            </KeyboardAvoidingView>
        </ThemedSafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    keyboardAvoidingView: {
        flex: 1,
        padding: 0
    },
    header: {
        backgroundColor: '#4f46e5',
        padding: 16,
        flexDirection: 'row',
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 20,
    },
    botIcon: {
        width: 40,
        height: 40,
        backgroundColor: '#818cf8',
        borderRadius: 9999,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    botIconText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    messagesContainer: {
        flex: 1,
        padding: 16,
    },
    messagesContent: {
        paddingBottom: 20,
    },
    messageWrapper: {
        flexDirection: 'row',
        marginVertical: 4,
    },
    userMessageWrapper: {
        justifyContent: 'flex-end',
    },
    botMessageWrapper: {
        justifyContent: 'flex-start',
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    userMessageBubble: {
        backgroundColor: '#4f46e5',
        borderBottomRightRadius: 4,
    },
    botMessageBubble: {
        backgroundColor: '#e5e7eb',
        borderBottomLeftRadius: 4,
    },
    userMessageText: {
        color: '#fff',
    },
    botMessageText: {
        color: '#1f2937',
    },
    typingIndicatorWrapper: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginVertical: 4,
    },
    typingIndicatorBubble: {
        backgroundColor: '#e5e7eb',
        padding: 12,
        borderRadius: 16,
        borderBottomLeftRadius: 4,
    },
    typingIndicatorText: {
        color: '#1f2937',
        fontStyle: 'italic',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    textInput: {
        flex: 1,
        height: 44,
        borderRadius: 22,
        paddingHorizontal: 16,
        marginRight: 10,
        fontSize: 16,
    },
    sendButton: {
        backgroundColor: '#4f46e5',
        borderRadius: 22,
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    backButton: {
        padding: 8,
    }
});

export default ChatbotScreen;
