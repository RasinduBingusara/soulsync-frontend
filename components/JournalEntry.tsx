import {StyleSheet,TouchableOpacity, Modal } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from "expo-router";
import { IJournalPostData } from "./custom-interface/CustomProps";
import { getDate, getTime } from '@/components/custom-function/DateTime';
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";



export const JournalEntry = ({ id, content, createAt, mood, onDelete }: IJournalPostData) => {

    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const confirmDelete = () => {
        if (id !== undefined) {
            onDelete(id);
        }
        setShowDeleteModal(false);
    };

    const editEntry = () => {
        router.navigate({
            pathname: '/(screen)/journal_edit',
            params: { id, createAt, mood, content }
        });
        setShowDeleteModal(false);
    }

    useEffect(() => {
        if (createAt) {
            setDate(getDate(createAt));
            setTime(getTime(createAt));
        }
    }, [createAt]);

    return (
        <ThemedView style={[styles.journalItem, true && styles.completedJournal]}>
            <ThemedView style={styles.journalItemContent}>

                <ThemedView style={styles.journalDetails}>

                    <ThemedView style={styles.journalMeta}>
                        <ThemedText style={styles.dueDateText}>{getDate(createAt)} / {getTime(createAt)}</ThemedText>
                    </ThemedView>
                    <ThemedText style={styles.contentTitle}>
                        {content}
                    </ThemedText>
                    <ThemedText style={{ color: '#6b7280', fontSize: 12 }}>
                        Mood: {mood}
                    </ThemedText>
                </ThemedView>
            </ThemedView>


            <ThemedView style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity onPress={editEntry} style={styles.removeButton}>
                    <FontAwesome name="edit" size={25} color="#179b05ff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowDeleteModal(true)} style={styles.removeButton}>
                    <FontAwesome name="trash" size={25} color="#ef4444" />
                </TouchableOpacity>
            </ThemedView>

            <Modal
                animationType="fade"
                transparent={true}
                visible={showDeleteModal}
                onRequestClose={() => setShowDeleteModal(false)}
            >
                <ThemedView style={styles.centeredView}>
                    <ThemedView style={styles.modalView}>
                        <ThemedText style={styles.modalText}>Are you sure you want to delete this task?</ThemedText>
                        <ThemedView style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.buttonCancel]}
                                onPress={() => setShowDeleteModal(false)}
                            >
                                <ThemedText style={styles.buttonText}>Cancel</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.buttonDelete]}
                                onPress={confirmDelete}
                            >
                                <ThemedText style={styles.buttonText}>Delete</ThemedText>
                            </TouchableOpacity>
                        </ThemedView>
                    </ThemedView>
                </ThemedView>
            </Modal>

        </ThemedView>
    )
};

const styles = StyleSheet.create({
    journalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#f9fafb',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
        borderWidth:1,
        borderColor: '#6a6a6aff',
    },
    completedJournal: {
        backgroundColor: '#e5e7eb',
        opacity: 0.6,
    },
    journalItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    journalDetails: {
        marginLeft: 16,
        flexShrink: 1,
    },
    journalTitle: {
        fontSize: 16,
        fontWeight: '500',
    },
    contentTitle: {
        fontSize: 14,
    },
    completedTitle: {
        textDecorationLine: 'line-through',
        color: '#9ca3af',
    },
    journalMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    dueDateText: {
        fontSize: 10,
        color: '#6b7280',
        marginRight: 8,
    },
    priorityTag: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 9999,
    },
    highPriority: {
        backgroundColor: '#fecaca',
    },
    mediumPriority: {
        backgroundColor: '#fde68a',
    },
    lowPriority: {
        backgroundColor: '#d1fae5',
    },
    priorityText: {
        fontSize: 10,
        fontWeight: '600',
    },
    optionsButton: {
        marginLeft: 16,
    },
    removeButton: {
        marginLeft: 16,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 30
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    modalButton: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        width: '45%',
        alignItems: 'center',
    },
    buttonDelete: {
        backgroundColor: "#ef4444",
    },
    buttonCancel: {
        backgroundColor: "#d1d5db",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
});

