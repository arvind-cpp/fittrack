import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { PREDEFINED_ROUTINES } from '../../constants/Data';
import { useWorkout } from '../../contexts/WorkoutContext';

export default function RoutinesScreen() {
    const { routines, deleteRoutine } = useWorkout();

    const isCustomRoutine = (id: string) => {
        return !PREDEFINED_ROUTINES.some(r => r.id === id);
    };



    const renderRoutine = ({ item }: { item: import('../../types').WorkoutRoutine }) => (
        <Pressable
            style={styles.card}
            onPress={() => router.push(`/workout/${item.id}`)}
        >
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.routineName}>{item.name}</Text>
                        <Text style={styles.routineDifficulty}>{item.difficulty} • {item.estimatedDurationMin} min</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>


                        <View style={styles.chevron}>
                            <Ionicons name="chevron-forward" size={24} color={Colors.textSecondary} />
                        </View>
                    </View>
                </View>
                <Text style={styles.routineDesc} numberOfLines={2}>{item.description}</Text>
                <View style={styles.exercisesPreview}>
                    <Text style={styles.previewText}>
                        {item.exercises.length} exercises including {item.exercises.slice(0, 3).map((e) => e.name).join(', ')}...
                    </Text>
                </View>
            </View>
        </Pressable>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={routines}
                keyExtractor={item => item.id}
                renderItem={renderRoutine}
                contentContainerStyle={styles.list}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <Text style={styles.title}>Workout Routines</Text>
                        <Text style={styles.subtitle}>Choose a program to start training</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    list: {
        padding: 16,
    },
    header: {
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.text,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginTop: 4,
    },
    card: {
        backgroundColor: Colors.card,
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    cardContent: {
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    routineName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 4,
    },
    routineDifficulty: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: '600',
    },
    chevron: {
        marginTop: 4,
    },
    routineDesc: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 12,
    },
    exercisesPreview: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: 8,
        borderRadius: 8,
    },
    previewText: {
        fontSize: 12,
        color: Colors.textSecondary,
        fontStyle: 'italic',
    },
});
