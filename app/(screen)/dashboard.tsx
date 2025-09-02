import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PieChart from 'react-native-pie-chart';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from '@react-native-firebase/auth';
import { DailyMood } from '@/components/custom-interface/CustomProps';
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

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

const emotions = {
    anger: { color: '#ef4444', icon: 'frown-o' },
    joy: { color: '#22c55e', icon: 'smile-o' },
    sadness: { color: '#3b82f6', icon: 'frown-o' },
    fear: { color: '#eab308', icon: 'meh-o' },
    love: { color: '#ec4899', icon: 'heart-o' },
    neutral: { color: '#94a3b8', icon: 'meh-o' },
};

export default function Dashboard() {
    const [dailyMoods, setDailyMoods] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [seriseList, setSerise] = useState<Array<{ value: number, color: string }>>([]);
    const [analysisText, setAnalysisText] = useState('');
    const [isAnalysable, setIsAnalysable] = useState(false);


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
            setDailyMoods(moods.slice(0, 7));
            setIsAnalysable(true);
        } catch (e) {
            console.error('Error loading daily moods:', e);
        } finally {
            setLoading(false);
        }
    };

    const fetchAnalysis = async (moods: DailyMood[]) => {
        setAnalysisText('Generating insights...');
        if (moods.length === 0) {
            setAnalysisText('No data to analyze. Please record some moods to get insights.');
            return;
        }

        try {
            const cachedAnalysis = await AsyncStorage.getItem('CachedAnalysis');
            if (cachedAnalysis) {
                const { text, timestamp } = JSON.parse(cachedAnalysis);
                const oneDayInMs = 24 * 60 * 60 * 1000;
                if (Date.now() - timestamp < oneDayInMs) {
                    setAnalysisText(text);
                    console.log('Using cached analysis from AsyncStorage.');
                    return;
                }
            }

            // If no valid cache, fetch a new analysis
            const response = await fetch('http://192.168.8.100:8000/analysis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ moods: moods }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const newAnalysis = data.analysis;
            
            // Save the new analysis to AsyncStorage with a timestamp
            await AsyncStorage.setItem('CachedAnalysis', JSON.stringify({
                text: newAnalysis,
                timestamp: Date.now()
            }));

            setAnalysisText(newAnalysis);
            setIsAnalysable(false);
        } catch (error) {
            console.error('Error fetching analysis:', error);
            setAnalysisText('An error occurred while fetching analysis. Please try again later.');
        }
    };

    const getPieChartSeriesData = async (days: number): Promise<Array<{ value: number, color: string }>> => {
        try {
            const uid = getAuth().currentUser?.uid || '';
            const storedMoods = await AsyncStorage.getItem('DailyMoods');
            const moods: DailyMood[] = storedMoods ? JSON.parse(storedMoods) : [];

            if (!Array.isArray(moods)) {
                console.error("Stored data is not a valid mood array.");
                return [];
            }

            const counts: { [key: string]: number } = {
                anger: 0,
                joy: 0,
                sadness: 0,
                fear: 0,
                love: 0,
                neutral: 0,
            };
            const today = new Date();

            for (let i = 0; i < days; i++) {
                const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i + 1);
                const dateString = date.toISOString().slice(0, 10);

                const moodEntry = moods.find(
                    (item) => item.date === dateString && item.uid === uid
                );

                if (moodEntry) {
                    // Initialize the count if the emotion hasn't been seen yet
                    if (counts[moodEntry.mood]) {
                        counts[moodEntry.mood]++;
                    } else {
                        counts[moodEntry.mood] = 1;
                    }
                }
            }
            console.log("counts:", counts)

            const pieChartSeries = Object.keys(counts)
                .map(label => ({
                    value: counts[label],
                    color: emotions[label as keyof typeof emotions]?.color || '#8f4646ff'
                }));

            return pieChartSeries;

        } catch (error) {
            console.error("Error fetching pie chart data:", error);
            return [];
        }
    };

    useEffect(() => {

        const fetchMoods = async () => {
            try {
                const last30DaysCounts = await getPieChartSeriesData(30);
                setSerise(last30DaysCounts);
                console.log('Emotion counts for last 30 days:', last30DaysCounts);
                // console.log('last 7 days moods:', await getLast7DaysMoods());
                fetchDailyMoods();
            } catch (error) {
                console.error("Failed to fetch moods:", error);
            }
        };
        fetchMoods();
    }, []);

    useEffect(() => {
        fetchAnalysis(dailyMoods);
    }, [isAnalysable]);

    return (
        <ThemedSafeAreaView style={styles.safeArea} darkColor='#000000ff'>
            <ScrollView style={styles.container}>
                {/* Header */}
                <ThemedView style={styles.headerContainer} backgroundVisible={false}>
                    <TouchableOpacity style={styles.backButton} onPress={() => { router.push('..') }}>
                        <FontAwesome name="arrow-left" size={24} color="#6b7280" />
                    </TouchableOpacity>
                    <ThemedText style={styles.headerTitle}>Emotion Dashboard</ThemedText>
                </ThemedView>

                <ThemedView style={styles.chartCard}>
                    <ThemedText style={styles.cardTitle}>Your Daily Moods</ThemedText>
                    {dailyMoods.length === 0 ? (
                        <ThemedText style={{ color: '#6b7280', marginTop: 12 }}>No daily moods recorded.</ThemedText>
                    ) : (
                        dailyMoods.map((entry, idx) => (
                            <ThemedView key={idx} style={styles.dailyMoodRow} darkColor='#2727276e'>
                                <ThemedText style={styles.dailyMoodDate}>{entry.date}</ThemedText>
                                <ThemedView style={[styles.dailyMoodTag, {
                                    backgroundColor:
                                        entry.mood === 0 ? '#ef4444' :
                                            entry.mood === 1 ? '#eab308' :
                                                entry.mood === 2 ? '#22c55e' : '#94a3b8'
                                }]}>
                                    <ThemedText style={styles.dailyMoodText}>{moodCategoryMap[entry.mood] || entry.mood}</ThemedText>
                                </ThemedView>
                                <ThemedText style={styles.dailyMoodAbout}>{entry.aboutToday}</ThemedText>
                            </ThemedView>
                        ))
                    )}
                </ThemedView>

                {/* Charts Container */}
                <ThemedView style={styles.chartsContainer} backgroundVisible={false}>
                    <ThemedView style={styles.chartCard}>
                        <ThemedText style={styles.cardTitle}>Monthly Emotion Distribution</ThemedText>
                        {
                            seriseList[0] && (
                                <PieChart
                                    widthAndHeight={250}
                                    series={seriseList}
                                />
                            )
                        }

                        <ThemedView style={styles.pieContainer}>
                            {Object.keys(emotions).map((emotion, index) => (
                                <ThemedView key={index} style={styles.pieItem}>
                                    <View style={[styles.pieColor, { backgroundColor: emotions[emotion as keyof typeof emotions].color }]} />
                                    <ThemedText style={styles.pieLabel}>{emotion}</ThemedText>
                                </ThemedView>
                            ))}
                        </ThemedView>
                    </ThemedView>
                </ThemedView>

                {/* Analysis Section */}
                <ThemedView style={styles.analysisCard}>
                    <ThemedText style={styles.cardTitle}>Insights & Analysis</ThemedText>
                    <ThemedText style={styles.analysisText}>
                        {analysisText}
                    </ThemedText>

                </ThemedView>
            </ScrollView>
        </ThemedSafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
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
        borderRadius: 24,
        shadowColor: '#6f6f6fff',
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
        gap: 10,
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
        borderRadius: 20,
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
    },
    dailyMoodAbout: {
        fontSize: 13,
        color: '#334155',
        flex: 1,
    },
});
