import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VictoryAxis, VictoryBar, VictoryChart } from 'victory-native';
import { Colors } from '../../constants/Colors';
import { useWorkout } from '../../contexts/WorkoutContext';

export default function AnalyticsScreen() {
    const { history } = useWorkout();

    // Aggregate workouts per day for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
    });

    const workoutCounts = last7Days.map(date => {
        return {
            date: date.substring(5), // mm-dd
            count: history.filter(h => h.startTime && h.startTime.startsWith(date)).length
        };
    });

    const totalVolume = history.reduce((acc, session) => {
        const sessionVolume = session.exercises?.reduce((sAcc, ex) => {
            return sAcc + (ex.sets?.reduce((setAcc, set) => setAcc + (set.completed ? (set.reps || 0) * (set.weight || 0) : 0), 0) || 0);
        }, 0) || 0;
        return acc + sessionVolume;
    }, 0);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Progress Analytics</Text>

                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{history.length}</Text>
                        <Text style={styles.statLabel}>Total Workouts</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{(totalVolume / 1000).toFixed(1)}k</Text>
                        <Text style={styles.statLabel}>Vol. Lifted (kg)</Text>
                    </View>
                </View>

                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Workouts (Last 7 Days)</Text>
                    {history.length > 0 ? (
                        <VictoryChart
                            width={Dimensions.get('window').width - 48}
                            domainPadding={20}
                        >
                            <VictoryAxis
                                tickValues={workoutCounts.map(d => d.date)}
                                style={{
                                    tickLabels: { fill: Colors.textSecondary, fontSize: 10, padding: 5 },
                                    axis: { stroke: Colors.border }
                                }}
                            />
                            <VictoryAxis
                                dependentAxis
                                style={{
                                    tickLabels: { fill: Colors.textSecondary, fontSize: 10, padding: 5 },
                                    axis: { stroke: Colors.border },
                                    grid: { stroke: Colors.border, strokeDasharray: '4, 4' }
                                }}
                            />
                            <VictoryBar
                                data={workoutCounts}
                                x="date"
                                y="count"
                                style={{ data: { fill: Colors.primary } }}
                                cornerRadius={4}
                                barWidth={20}
                            />
                        </VictoryChart>
                    ) : (
                        <View style={styles.noData}>
                            <Text style={styles.noDataText}>Complete a workout to see data</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 24,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
    },
    statCard: {
        flex: 1,
        backgroundColor: Colors.card,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 4,
    },
    chartContainer: {
        backgroundColor: Colors.card,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    chartTitle: {
        fontSize: 16,
        color: Colors.text,
        alignSelf: 'flex-start',
        marginBottom: 16,
        fontWeight: '600',
    },
    noData: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noDataText: {
        color: Colors.textSecondary,
    },
});
