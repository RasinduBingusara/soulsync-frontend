import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PieChart from 'react-native-pie-chart';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from '@react-native-firebase/auth';
import { DailyMood } from '@/components/custom-interface/CustomProps';

const { width } = Dimensions.get('window');

const emotionLabels = ['Anger', 'Fear', 'Joy', 'Love', 'Neutral', 'Sadness'];

const pieData = [
    { color: '#ef4444', label: 'Anger' },
    { color: '#eab308', label: 'Fear' },
    { color: '#22c55e', label: 'Joy' },
    { color: '#ec4899', label: 'Love' },
    { color: '#94a3b8', label: 'Neutral' },
    { color: '#3b82f6', label: 'Sadness' },
];

const dayNightColors = [{
    time: 'day', color: '#4f46e5'
},
{ time: 'night', color: '#22c55e' }];

const moodCategoryMap: { [key: number]: string } = {
    0: 'Negative',
    1: 'Neutral',
    2: 'Positive'
};

export default function Dashboard() {
    const [dailyMoods, setDailyMoods] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const getLast7DaysMoods = async (): Promise<DailyMood[]> => {
        try {
            const uid = getAuth().currentUser?.uid || '';
            const storedMoods = await AsyncStorage.getItem('DailyMoods');
            const moods: DailyMood[] = storedMoods ? JSON.parse(storedMoods) : [];

            const last7DaysMoods: DailyMood[] = [];
            const today = new Date();

            for (let i = 0; i < 3; i++) {
                // Find the mood entry for the specific day and user
                const moodEntry = moods.find(
                    (item) => item.uid === uid
                );

                if (moodEntry) {
                    last7DaysMoods.push(moodEntry);
                } else {
                    null;
                }
            }

            // Reverse the array to have the oldest day first, which is useful for charting
            return last7DaysMoods.reverse();

        } catch (error) {
            console.error("Error fetching last 7 days moods:", error);
            return [];
        }
    };

    const fetchDailyMoods = async () => {
        setLoading(true);
        try {
            const auth = getAuth();
            const uid = auth.currentUser?.uid || '';
            const stored = await AsyncStorage.getItem('DailyMoods');
            let moods = stored ? JSON.parse(stored) : [];
            // Only show moods for current user
            moods = moods.filter((item: any) => item.uid === uid);
            // Sort by date descending
            moods.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setDailyMoods(moods);
        } catch (e) {
            console.error('Error loading daily moods:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchMoods = async () => {
            try {
                console.log('last 7 days moods:', await getLast7DaysMoods());
                fetchDailyMoods();
            } catch (error) {
                console.error("Failed to fetch moods:", error);
            }
        };
        fetchMoods();
        fetchDailyMoods();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                {/* Header */}
                <View style={styles.headerContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={() => { router.push('..') }}>
                        <FontAwesome name="arrow-left" size={24} color="#6b7280" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Emotion Dashboard</Text>
                </View>

                <View style={styles.chartCard}>
                    <Text style={styles.cardTitle}>Your Daily Moods</Text>
                    {dailyMoods.length === 0 ? (
                        <Text style={{ color: '#6b7280', marginTop: 12 }}>No daily moods recorded.</Text>
                    ) : (
                        dailyMoods.map((entry, idx) => (
                            <View key={idx} style={styles.dailyMoodRow}>
                                <Text style={styles.dailyMoodDate}>{entry.date}</Text>
                                <View style={[styles.dailyMoodTag, {
                                    backgroundColor:
                                        entry.mood === 0 ? '#ef4444' :
                                            entry.mood === 1 ? '#eab308' :
                                                entry.mood === 2 ? '#22c55e' : '#94a3b8'
                                }]}>
                                    <Text style={styles.dailyMoodText}>{moodCategoryMap[entry.mood] || entry.mood}</Text>
                                </View>
                                <Text style={styles.dailyMoodAbout}>{entry.aboutToday}</Text>
                            </View>
                        ))
                    )}
                </View>

                {/* Charts Container */}
                <View style={styles.chartsContainer}>
                    <View style={styles.chartCard}>
                        <Text style={styles.cardTitle}>Monthly Emotion Distribution</Text>
                        <PieChart
                            widthAndHeight={250}
                            series={[
                                { value: 10, color: '#ef4444' },
                                { value: 4, color: '#eab308' },
                                { value: 5, color: '#22c55e' },
                                { value: 2, color: '#ec4899' },
                                { value: 5, color: '#94a3b8' },
                                { value: 3, color: '#3b82f6' }
                            ]}
                        />
                        <View style={styles.pieContainer}>
                            {pieData.map((item, index) => (
                                <View key={index} style={styles.pieItem}>
                                    <View style={[styles.pieColor, { backgroundColor: item.color }]} />
                                    <Text style={styles.pieLabel}>{item.label}</Text>
                                    <Text style={styles.pieValue}>{[10, 4, 5, 2, 5, 3][index]}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                    {/* ...LineGraphComponent can go here if needed... */}
                </View>

                {/* Analysis Section */}
                <View style={styles.analysisCard}>
                    <Text style={styles.cardTitle}>Insights & Analysis</Text>
                    <Text style={styles.analysisText}>
                        This week, your morning moods show a slightly different pattern than your evening moods. A clear positive trend is visible towards the end of the week, suggesting your emotional well-being is on the rise.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    container: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 24,
    },
    header: {
        marginBottom: 24,
        alignItems: 'center',
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
    headerSubtitle: {
        color: '#6b7280',
        marginTop: 8,
    },
    chartsContainer: {
        flexDirection: 'column',
        gap: 16,
    },
    chartCard: {
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        padding: 10,
        marginBottom: 16,
        gap: 5,

    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 16,
        color: '#374151',
    },
    pieContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 16,
        marginTop: 16,
    },
    pieItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    pieColor: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 8,
    },
    pieLabel: {
        fontSize: 14,
        color: '#4b5563',
    },
    pieValue: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
    lineGraphContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    lineGraphYAxis: {
        justifyContent: 'space-between',
        height: 120, // Adjust height to match the number of labels
        marginRight: 8,
        paddingTop: 10,
        paddingBottom: 20,
    },
    yAxisLabel: {
        fontSize: 12,
        color: '#6b7280',
    },
    lineGraphChart: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: 120,
    },
    lineGraphDay: {
        alignItems: 'center',
        position: 'relative',
        height: '100%',
        justifyContent: 'flex-end',
        width: (width - 100) / 7, // Dynamic width based on screen size
    },
    dayLabel: {
        position: 'absolute',
        bottom: -20,
        fontSize: 12,
        color: '#4b5563',
    },
    pointContainer: {
        position: 'absolute',
        width: 10,
        height: 10,
    },
    linePoint: {
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: 'white',
    },
    linePointLabel: {
        position: 'absolute',
        top: -10,
        fontSize: 10,
    },
    analysisCard: {
        backgroundColor: 'white',
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        padding: 24,
        marginTop: 16,
        marginBottom: 32,
    },
    analysisText: {
        color: '#4b5563',
        textAlign: 'center',
    },
    dailyMoodRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        borderRadius: 10,
        padding: 10,
        marginBottom: 8,
        gap: 10,
    },
    dailyMoodDate: {
        fontSize: 13,
        color: '#64748b',
        width: 80,
    },
    dailyMoodTag: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        marginRight: 8,
    },
    dailyMoodText: {
        fontSize: 13,
        fontWeight: '700',
        color: 'white',
    },
    dailyMoodAbout: {
        fontSize: 13,
        color: '#334155',
        flex: 1,
    },
});
