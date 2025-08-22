import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const CHAT_KEY = '@chat_messages';
const ChatbotScreen = () => {
    const [userInput, setUserInput] = useState('');
    const [messages, setMessages] = useState([
        { text: 'Hello! How can I help you today?', sender: 'bot' },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const scrollViewRef = useRef<ScrollView | null>(null);

    // Function to add a new message to the state
    const addMessage = (text: string, sender: string) => {
        setMessages(prevMessages => {
            const newMessages = [...prevMessages, { text, sender }];
            saveMessages(newMessages); // Save messages after updating the state
            return newMessages;
        });
    };

    useEffect(() => {
        const loadMessages = async () => {
            try {
                const storedMessages = await AsyncStorage.getItem(CHAT_KEY);
                if (storedMessages !== null) {
                    setMessages(JSON.parse(storedMessages));
                } else {
                    // Set an initial welcome message if no data exists
                    setMessages([{ text: 'Hello! How can I help you today?', sender: 'bot' }]);
                }
            } catch (error) {
                console.error('Failed to load messages from AsyncStorage', error);
                // Fallback to a default message on error
                setMessages([{ text: 'Hello! How can I help you today?', sender: 'bot' }]);
            }
        };

        loadMessages();
    }, []); // Empty dependency array ensures this runs only once

    // Save messages to AsyncStorage
    const saveMessages = async (currentMessages:any) => {
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
                console.log('await started: ',url);
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
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoidingView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Chatbot Header */}
                <View style={styles.header}>
                    <View style={styles.headerContent}>
                        <View style={styles.botIcon}>
                            <Text style={styles.botIconText}>G</Text>
                        </View>
                        <Text style={styles.headerTitle}>Gemini Chatbot</Text>
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

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Type your message..."
                        placeholderTextColor="#9ca3af"
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
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#e5e7eb',
    },
    keyboardAvoidingView: {
        flex: 1,
        padding: 0
    },
    header: {
        backgroundColor: '#4f46e5',
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
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
        backgroundColor: '#f3f4f6',
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
        backgroundColor: '#f9fafb',
        borderRadius: 22,
        paddingHorizontal: 16,
        marginRight: 10,
        fontSize: 16,
        color: '#1f2937',
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
});

export default ChatbotScreen;
