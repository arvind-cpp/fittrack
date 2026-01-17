import { useLocalSearchParams, router } from 'expo-router';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useWorkout } from '../../contexts/WorkoutContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

export default function RoutineDetailScreen() {
    const { id } = useLocalSearchParams();
    const { routines, startWorkout } = useWorkout();

    const routine = routines.find(r => r.id === id);

    if (!routine) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>Routine not found</Text>
            </View>
        );
    }

    const handleStart = () => {
        startWorkout(routine.id);
        router.push('/workout/active');
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>{routine.name}</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{routine.difficulty}</Text>
                    </View>
                </View>

                <Text style={styles.description}>{routine.description}</Text>

                <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                        <Ionicons name="time-outline" size={20} color={Colors.textSecondary} />
                        <Text style={styles.metaText}>{routine.estimatedDurationMin} min</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Ionicons name="barbell-outline" size={20} color={Colors.textSecondary} />
                        <Text style={styles.metaText}>{routine.exercises.length} Exercises</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Exercises</Text>
                {routine.exercises.map((exercise, index) => (
                    <View key={exercise.id} style={styles.exerciseCard}>
                        <View style={styles.exerciseIndex}>
                            <Text style={styles.indexText}>{index + 1}</Text>
                        </View>
                        <View style={styles.exerciseInfo}>
                            <Text style={styles.exerciseName}>{exercise.name}</Text>
                            <Text style={styles.exerciseDetails}>
                                {exercise.defaultSets} sets × {exercise.defaultReps} reps • {exercise.muscleGroup}
                            </Text>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.footer}>
                <Pressable style={styles.startButton} onPress={handleStart}>
                    <Text style={styles.startButtonText}>Start Workout</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
    content: {
        padding: 24,
        paddingBottom: 100,
    },
    header: {
        marginBottom: 12,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 8,
    },
    badge: {
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeText: {
        color: Colors.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    description: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginBottom: 24,
        lineHeight: 24,
    },
    metaRow: {
        flexDirection: 'row',
        gap: 24,
        marginBottom: 32,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    metaText: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: '500',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 16,
    },
    exerciseCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.card,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    exerciseIndex: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    indexText: {
        color: Colors.textSecondary,
        fontWeight: 'bold',
    },
    exerciseInfo: {
        flex: 1,
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 4,
    },
    exerciseDetails: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    errorText: {
        color: Colors.danger,
        fontSize: 18,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        backgroundColor: Colors.background, // or transparent with blur
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    startButton: {
        backgroundColor: Colors.primary,
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
    },
    startButtonText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});
