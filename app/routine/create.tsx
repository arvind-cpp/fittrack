import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useWorkout } from '../../contexts/WorkoutContext';
import { Exercise } from '../../types';

export default function CreateRoutineScreen() {
    const { addRoutine } = useWorkout();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
    const [duration, setDuration] = useState('');

    // Simplified exercise creation: just name, sets, caps
    const [exercises, setExercises] = useState<Partial<Exercise>[]>([]);

    const addExercise = () => {
        setExercises([...exercises, {
            id: Date.now().toString(),
            name: '',
            defaultSets: 3,
            defaultReps: 10,
            defaultRestSeconds: 60,
            muscleGroup: 'Full Body'
        }]);
    };

    const updateExercise = (index: number, field: keyof Exercise, value: any) => {
        const newExercises = [...exercises];
        newExercises[index] = { ...newExercises[index], [field]: value };
        setExercises(newExercises);
    };

    const removeExercise = (index: number) => {
        const newExercises = [...exercises];
        newExercises.splice(index, 1);
        setExercises(newExercises);
    };

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter a routine name');
            return;
        }
        if (exercises.length === 0) {
            Alert.alert('Error', 'Please add at least one exercise');
            return;
        }

        // Validate exercises
        for (const ex of exercises) {
            if (!ex.name?.trim()) {
                Alert.alert('Error', 'All exercises must have a name');
                return;
            }
        }

        const newRoutine = {
            id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name,
            description,
            difficulty,
            estimatedDurationMin: parseInt(duration) || 30,
            exercises: exercises as Exercise[],
        };

        await addRoutine(newRoutine);
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </Pressable>
                <Text style={styles.title}>Create Routine</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Routine Name</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="e.g., Morning Cardio"
                        placeholderTextColor={Colors.textSecondary}
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Brief description of this routine..."
                        placeholderTextColor={Colors.textSecondary}
                        multiline
                    />
                </View>

                <View style={styles.row}>
                    <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                        <Text style={styles.label}>Est. Duration (min)</Text>
                        <TextInput
                            style={styles.input}
                            value={duration}
                            onChangeText={setDuration}
                            keyboardType="numeric"
                            placeholder="30"
                            placeholderTextColor={Colors.textSecondary}
                        />
                    </View>
                    <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                        <Text style={styles.label}>Difficulty</Text>
                        <View style={styles.difficultyContainer}>
                            {(['Beginner', 'Intermediate', 'Advanced'] as const).map((d) => (
                                <Pressable
                                    key={d}
                                    style={[styles.diffChip, difficulty === d && styles.diffChipActive]}
                                    onPress={() => setDifficulty(d)}
                                >
                                    <Text style={[styles.diffText, difficulty === d && styles.diffTextActive]}>{d[0]}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Exercises</Text>

                {exercises.map((ex, index) => (
                    <View key={ex.id || index} style={styles.exerciseCard}>
                        <View style={styles.exerciseHeader}>
                            <Text style={styles.exerciseIndex}>#{index + 1}</Text>
                            <Pressable onPress={() => removeExercise(index)}>
                                <Ionicons name="trash-outline" size={20} color={Colors.danger} />
                            </Pressable>
                        </View>

                        <TextInput
                            style={[styles.input, { marginBottom: 8 }]}
                            value={ex.name}
                            onChangeText={(v) => updateExercise(index, 'name', v)}
                            placeholder="Exercise Name"
                            placeholderTextColor={Colors.textSecondary}
                        />

                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <Text style={styles.subLabel}>Sets</Text>
                                <TextInput
                                    style={styles.input}
                                    value={ex.defaultSets?.toString()}
                                    onChangeText={(v) => updateExercise(index, 'defaultSets', parseInt(v) || 0)}
                                    keyboardType="numeric"
                                    placeholder="3"
                                    placeholderTextColor={Colors.textSecondary}
                                />
                            </View>
                            <View style={{ flex: 1, marginLeft: 8 }}>
                                <Text style={styles.subLabel}>Reps</Text>
                                <TextInput
                                    style={styles.input}
                                    value={ex.defaultReps?.toString()}
                                    onChangeText={(v) => updateExercise(index, 'defaultReps', parseInt(v) || 0)}
                                    keyboardType="numeric"
                                    placeholder="10"
                                    placeholderTextColor={Colors.textSecondary}
                                />
                            </View>
                            <View style={{ flex: 1, marginLeft: 8 }}>
                                <Text style={styles.subLabel}>Rest (s)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={ex.defaultRestSeconds?.toString()}
                                    onChangeText={(v) => updateExercise(index, 'defaultRestSeconds', parseInt(v) || 0)}
                                    keyboardType="numeric"
                                    placeholder="60"
                                    placeholderTextColor={Colors.textSecondary}
                                />
                            </View>
                        </View>
                    </View>
                ))}

                <Pressable style={styles.addButton} onPress={addExercise}>
                    <Ionicons name="add" size={24} color={Colors.primary} />
                    <Text style={styles.addButtonText}>Add Exercise</Text>
                </Pressable>

                <View style={{ height: 40 }} />
            </ScrollView>

            <View style={styles.footer}>
                <Pressable style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Create Routine</Text>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    backButton: {
        padding: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
    },
    content: {
        padding: 24,
        paddingBottom: 100,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        color: Colors.textSecondary,
        marginBottom: 8,
        fontSize: 14,
    },
    input: {
        backgroundColor: Colors.card,
        color: Colors.text,
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        fontSize: 16,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    difficultyContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    diffChip: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: Colors.card,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    diffChipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    diffText: {
        color: Colors.textSecondary,
        fontWeight: 'bold',
    },
    diffTextActive: {
        color: Colors.white,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 16,
        marginTop: 8,
    },
    exerciseCard: {
        backgroundColor: Colors.card,
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    exerciseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    exerciseIndex: {
        color: Colors.textSecondary,
        fontWeight: 'bold',
    },
    subLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginBottom: 4,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderWidth: 2,
        borderColor: Colors.primary,
        borderStyle: 'dashed',
        borderRadius: 16,
        gap: 8,
    },
    addButtonText: {
        color: Colors.primary,
        fontWeight: 'bold',
        fontSize: 16,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        backgroundColor: Colors.background,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    saveButton: {
        backgroundColor: Colors.primary,
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
    },
    saveButtonText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});
