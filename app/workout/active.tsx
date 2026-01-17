import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useWorkout } from '../../contexts/WorkoutContext';
import { useTimer } from '../../hooks/useTimer';

export default function ActiveWorkoutScreen() {
    const { activeWorkout, finishWorkout, cancelWorkout } = useWorkout();
    const [exercises, setExercises] = useState(activeWorkout?.exercises || []);
    const [expandedExercise, setExpandedExercise] = useState<string | null>(exercises[0]?.id || null);

    const timer = useTimer(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (!activeWorkout) {
            router.replace('/(tabs)/routines');
        }
    }, [activeWorkout]);

    // Workout duration timer
    useEffect(() => {
        const interval = setInterval(() => {
            setDuration(d => d + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleSetUpdate = (exerciseId: string, setIndex: number, field: 'reps' | 'weight', value: string) => {
        const newExercises = [...exercises];
        const exercise = newExercises.find(e => e.id === exerciseId);
        if (exercise) {
            const val = parseFloat(value) || 0;
            exercise.sets[setIndex] = { ...exercise.sets[setIndex], [field]: val };
            setExercises(newExercises);
        }
    };

    const toggleSetComplete = (exerciseId: string, setIndex: number) => {
        const newExercises = [...exercises];
        const exercise = newExercises.find(e => e.id === exerciseId);
        if (exercise) {
            const set = exercise.sets[setIndex];
            set.completed = !set.completed;

            if (set.completed && exercise.defaultRestSeconds && exercise.defaultRestSeconds > 0) {
                timer.start(exercise.defaultRestSeconds);
            }

            setExercises(newExercises);
        }
    };

    const [confirmAction, setConfirmAction] = useState<'finish' | 'cancel' | null>(null);

    const handleFinish = () => {
        if (!activeWorkout) return;
        setConfirmAction('finish');
    };

    const handleCancel = () => {
        setConfirmAction('cancel');
    };

    const performFinish = async () => {
        if (!activeWorkout) return;
        const finishedSession = { ...activeWorkout, exercises: exercises || [], durationSeconds: duration };

        setConfirmAction(null);
        router.back();
        // Delay context update slightly to prevent UI flash/race condition during navigation animation
        setTimeout(() => {
            finishWorkout(finishedSession);
        }, 300);
    };

    const performCancel = () => {
        setConfirmAction(null);
        router.back();
        setTimeout(() => {
            cancelWorkout();
        }, 300);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!activeWorkout) return null;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={handleCancel} style={styles.headerButton}>
                    <Ionicons name="close" size={24} color={Colors.text} />
                </Pressable>
                <View style={styles.headerContent}>
                    <Text style={styles.routineTitle}>{activeWorkout.routineName}</Text>
                    <Text style={styles.timerText}>{formatTime(duration)}</Text>
                </View>
                <Pressable onPress={handleFinish} style={styles.finishButton}>
                    <Text style={styles.finishText}>Finish</Text>
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {exercises.map((exercise, index) => {
                    const isExpanded = expandedExercise === exercise.id;
                    const completedSets = exercise.sets.filter(s => s.completed).length;

                    return (
                        <View key={exercise.id} style={styles.exerciseCard}>
                            <Pressable
                                style={styles.exerciseHeader}
                                onPress={() => setExpandedExercise(isExpanded ? null : exercise.id)}
                            >
                                <View>
                                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                                    <Text style={styles.exerciseProgress}>
                                        {completedSets} / {exercise.sets.length} sets completed
                                    </Text>
                                </View>
                                <Ionicons
                                    name={isExpanded ? "chevron-up" : "chevron-down"}
                                    size={24}
                                    color={Colors.textSecondary}
                                />
                            </Pressable>

                            {isExpanded && (
                                <View style={styles.setsContainer}>
                                    <View style={styles.setRowHeader}>
                                        <Text style={[styles.setLabel, { width: 40 }]}>Set</Text>
                                        <Text style={[styles.setLabel, { flex: 1 }]}>Previous</Text>
                                        <Text style={[styles.setLabel, { width: 60 }]}>kg</Text>
                                        <Text style={[styles.setLabel, { width: 60 }]}>Reps</Text>
                                        <View style={{ width: 40 }} />
                                    </View>

                                    {exercise.sets.map((set, setIndex) => (
                                        <View key={set.id} style={[styles.setRow, set.completed && styles.setRowCompleted]}>
                                            <Text style={styles.setNumber}>{setIndex + 1}</Text>
                                            <Text style={styles.setPrevious}>-</Text>
                                            <TextInput
                                                style={styles.input}
                                                keyboardType="numeric"
                                                placeholder="0"
                                                placeholderTextColor={Colors.textSecondary}
                                                defaultValue={set.weight > 0 ? set.weight.toString() : ''}
                                                onChangeText={(v) => handleSetUpdate(exercise.id, setIndex, 'weight', v)}
                                            />
                                            <TextInput
                                                style={styles.input}
                                                keyboardType="numeric"
                                                placeholder="0"
                                                placeholderTextColor={Colors.textSecondary}
                                                defaultValue={set.reps.toString()}
                                                onChangeText={(v) => handleSetUpdate(exercise.id, setIndex, 'reps', v)}
                                            />
                                            <Pressable
                                                style={[styles.checkButton, set.completed && styles.checkButtonActive]}
                                                onPress={() => toggleSetComplete(exercise.id, setIndex)}
                                            >
                                                <Ionicons
                                                    name="checkmark"
                                                    size={18}
                                                    color={set.completed ? Colors.white : Colors.textSecondary}
                                                />
                                            </Pressable>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    );
                })}
            </ScrollView>

            {/* Rest Timer Modal / Overlay */}
            {timer.isRunning && (
                <View style={styles.timerOverlay}>
                    <Text style={styles.restLabel}>Resting</Text>
                    <Text style={styles.restTime}>{formatTime(timer.timeLeft)}</Text>
                    <View style={styles.timerControls}>
                        <Pressable style={styles.timerButton} onPress={() => timer.addTime(10)}>
                            <Text style={styles.timerButtonText}>+10s</Text>
                        </Pressable>
                        <Pressable style={[styles.timerButton, styles.skipButton]} onPress={timer.stop}>
                            <Text style={styles.timerButtonText}>Skip</Text>
                        </Pressable>
                    </View>
                </View>
            )}

            {/* Confirmation Modal */}
            <Modal
                visible={!!confirmAction}
                transparent
                animationType="fade"
                onRequestClose={() => setConfirmAction(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {confirmAction === 'finish' ? 'Finish Workout' : 'Cancel Workout'}
                        </Text>
                        <Text style={styles.modalMessage}>
                            {confirmAction === 'finish'
                                ? 'Are you sure you want to finish this workout?'
                                : 'Are you sure? All progress for this session will be lost.'}
                        </Text>
                        <View style={styles.modalActions}>
                            <Pressable
                                style={[styles.modalButton, styles.modalButtonCancel]}
                                onPress={() => setConfirmAction(null)}
                            >
                                <Text style={styles.modalButtonTextCancel}>Go Back</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.modalButton, styles.modalButtonConfirm, confirmAction === 'cancel' && styles.modalButtonDestructive]}
                                onPress={confirmAction === 'finish' ? performFinish : performCancel}
                            >
                                <Text style={styles.modalButtonTextConfirm}>
                                    {confirmAction === 'finish' ? 'Finish' : 'Quit'}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    headerButton: {
        padding: 8,
    },
    headerContent: {
        alignItems: 'center',
    },
    routineTitle: {
        color: Colors.text,
        fontWeight: '600',
        fontSize: 16,
    },
    timerText: {
        color: Colors.textSecondary,
        fontSize: 14,
        fontVariant: ['tabular-nums'],
    },
    finishButton: {
        backgroundColor: Colors.success,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    finishText: {
        color: Colors.white,
        fontWeight: 'bold',
    },
    content: {
        padding: 16,
        paddingBottom: 100,
    },
    exerciseCard: {
        backgroundColor: Colors.card,
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
    },
    exerciseHeader: {
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    exerciseName: {
        color: Colors.text,
        fontSize: 18,
        fontWeight: 'bold',
    },
    exerciseProgress: {
        color: Colors.textSecondary,
        fontSize: 12,
    },
    setsContainer: {
        padding: 16,
        paddingTop: 0,
    },
    setRowHeader: {
        flexDirection: 'row',
        marginBottom: 8,
        alignItems: 'center',
    },
    setLabel: {
        color: Colors.textSecondary,
        fontSize: 12,
        textAlign: 'center',
    },
    setRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        backgroundColor: Colors.background,
        borderRadius: 8,
        padding: 4,
    },
    setRowCompleted: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
    },
    setNumber: {
        width: 40,
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    setPrevious: {
        flex: 1,
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    input: {
        width: 60,
        backgroundColor: Colors.card,
        color: Colors.text,
        textAlign: 'center',
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.border,
        marginHorizontal: 4,
    },
    checkButton: {
        width: 40,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.border,
        borderRadius: 8,
        marginLeft: 4,
    },
    checkButtonActive: {
        backgroundColor: Colors.success,
    },
    timerOverlay: {
        position: 'absolute',
        bottom: 24,
        left: 24,
        right: 24,
        backgroundColor: Colors.primary,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    restLabel: {
        color: Colors.white,
        fontSize: 14,
        opacity: 0.8,
    },
    restTime: {
        color: Colors.white,
        fontSize: 32,
        fontWeight: 'bold',
        fontVariant: ['tabular-nums'],
        marginVertical: 4,
    },
    timerControls: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 8,
    },
    timerButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    skipButton: {
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    timerButtonText: {
        color: Colors.white,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        backgroundColor: Colors.card,
        borderRadius: 16,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 12,
    },
    modalMessage: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginBottom: 24,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    modalButtonCancel: {
        backgroundColor: 'transparent',
    },
    modalButtonConfirm: {
        backgroundColor: Colors.success,
    },
    modalButtonDestructive: {
        backgroundColor: Colors.danger,
    },
    modalButtonTextCancel: {
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    modalButtonTextConfirm: {
        color: Colors.white,
        fontWeight: '600',
    },
});
