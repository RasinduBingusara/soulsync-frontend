import { View, StyleSheet, Text, TouchableOpacity, Modal } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from "expo-router";

interface IDateTime {
    date: string,
    time: string
}

const getDateTime = (timestamp: string): IDateTime => {

    const dateObject = new Date(timestamp);

    const datePart = dateObject.toISOString().split('T')[0];
    const localTime = dateObject.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    return {
        date: datePart,
        time: localTime
    }
}


export const JournalEntry = ({ id, timestamp, mood, content, emotionColor = '#d0d0d0ff', onDelete, moreOption = true }: any) => {

    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);

    const deleteEntry = () => {
        onDelete();
        setIsModalVisible(false);
    }

    const editEntry = () => {
        router.navigate({
            pathname: '/(screen)/journal_edit',
            params: { id, timestamp, mood, content }
        });
        setIsModalVisible(false);
    }

    useEffect(() => {
        if (timestamp) {
            const { date, time } = getDateTime(timestamp);
            setDate(date);
            setTime(time);
        }
    }, [timestamp]);

    return (
        <View style={styles.entryContainer}>
            <View style={styles.entryHeader}>
                <View>
                    <Text style={styles.entryDate}>{date}</Text>
                    <Text style={styles.entryDate}>{time}</Text>
                </View>

                <View style={{ alignItems: 'flex-end', gap: 5 }}>
                    {
                        moreOption && (
                            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                                <MaterialCommunityIcons name="dots-horizontal" size={25} color="black" />
                            </TouchableOpacity>
                        )
                    }

                    <View style={[styles.emotionTag, { backgroundColor: emotionColor }]}>
                        <FontAwesome name={mood === 'Happy' ? 'smile-o' : mood === 'Sad' ? 'frown-o' : 'meh-o'} size={12} color="white" />
                        <Text style={styles.emotionText}>{mood}</Text>
                    </View>
                </View>
            </View>
            <Text style={styles.entryText}>{content}</Text>

            <Modal
                visible={isModalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalContainer}
                    activeOpacity={1}
                    onPressOut={() => setIsModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.option} onPress={() => editEntry()}>
                            <MaterialCommunityIcons name="application-edit" size={24} color="green" />
                            <Text style={[styles.optionText, { color: 'green' }]}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.option} onPress={() => { deleteEntry() }}>
                            <MaterialCommunityIcons name="delete" size={24} color="red" />
                            <Text style={[styles.optionText, { color: 'red' }]}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    )
};

const styles = StyleSheet.create({

    entryContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        padding: 16,
    },
    entryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    entryDate: {
        fontSize: 12,
        fontWeight: '500',
        color: '#6b7280',
    },
    emotionTag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
        gap: 4,
    },
    emotionText: {
        fontSize: 12,
        fontWeight: '600',
        color: 'white',
    },
    entryText: {
        fontSize: 14,
        color: '#374151',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end', // Aligns content to the bottom
        backgroundColor: 'rgba(0, 0, 0, 0)',
        marginBottom: 50
    },
    modalContent: {
        backgroundColor: 'white',
        width: '100%', // Makes it span the full width
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        paddingBottom: 50
    },
    option: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ccc',
        gap: 10
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
});