import React from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PieChart from 'react-native-pie-chart';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');


const emotionLabels = ['Anger', 'Fear', 'Joy', 'Love', 'Neutral', 'Sadness'];

const serise = [
    { value: 10, color: '#ef4444' },
    { value: 4, color: '#eab308' },
    { value: 5, color: '#22c55e' },
    { value: 2, color: '#ec4899' },
    { value: 5, color: '#94a3b8' },
    { value: 3, color: '#3b82f6' },
]

const pieData = [
    { color: '#ef4444', label: 'Anger' },
    { color: '#eab308', label: 'Fear' },
    { color: '#22c55e', label: 'Joy' },
    { color: '#ec4899', label: 'Love' },
    { color: '#94a3b8', label: 'Neutral' },
    { color: '#3b82f6', label: 'Sadness' },
]

const dayNightColors = [{
    time: 'day', color: '#4f46e5'
},
{ time: 'night', color: '#22c55e' }];

const lineData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
        {
            label: 'Morning Mood',
            data: [1, 2, 1, 0, 2, 2, 2],
            color: dayNightColors[0].color
        },
        {
            label: 'Evening Mood',
            data: [0, 1, 2, 1, 1, 2, 2],
            color: dayNightColors[1].color
        }
    ]
};

// Map numerical data to categorical labels
const moodCategoryMap: { [key: number]: string } = {
    0: 'Negative',
    1: 'Neutral',
    2: 'Positive'
};


// Component for the Line Graph representation
const LineGraphComponent = () => (
    <View style={styles.chartCard}>
        <Text style={styles.cardTitle}>Weekly Mood Trends</Text>
        <View style={styles.lineGraphContainer}>
            <View style={styles.lineGraphYAxis}>
                <Text style={styles.yAxisLabel}>Positive</Text>
                <Text style={styles.yAxisLabel}>Neutral</Text>
                <Text style={styles.yAxisLabel}>Negative</Text>
            </View>
            <View style={styles.lineGraphChart}>
                {lineData.labels.map((day, index) => (
                    <View key={day} style={styles.lineGraphDay}>
                        <Text style={styles.dayLabel}>{day}</Text>
                        {lineData.datasets.map((dataset, dataIndex) => (
                            <View key={dataIndex} style={styles.pointContainer}>
                                <View style={[styles.linePoint, { backgroundColor: dataset.color, top: -dataset.data[index] * 20 - 20 }]} />
                                <Text style={[styles.linePointLabel, { color: dataset.color }]} />
                            </View>
                        ))}
                    </View>
                ))}
            </View>

        </View>
        <View style={{ marginTop: 25, flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 16 }}>
            {lineData.datasets.map((dataset, index) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <View style={{ width: 12, height: 12, backgroundColor: dataset.color, marginRight: 8 }} />
                    <Text style={{ color: '#4b5563' }}>{dataset.label}</Text>
                </View>
            ))}
        </View>
    </View>
);

export default function Dashboard() {
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

                {/* Charts Container */}
                <View style={styles.chartsContainer}>
                    <View style={styles.chartCard}>
                        <Text style={styles.cardTitle}>Monthly Emotion Distribution</Text>
                        <PieChart
                            widthAndHeight={250}
                            series={serise}
                        />
                        <View style={styles.pieContainer}>
                            {pieData.map((item, index) => (
                                <View key={index} style={styles.pieItem}>
                                    <View style={[styles.pieColor, { backgroundColor: item.color }]} />
                                    <Text style={styles.pieLabel}>{item.label}</Text>
                                    <Text style={styles.pieValue}>{serise[index].value}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                    <LineGraphComponent />
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
});
