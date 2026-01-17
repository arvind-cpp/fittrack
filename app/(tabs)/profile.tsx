import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { useWorkout } from '../../contexts/WorkoutContext';

export default function ProfileScreen() {
    const { userProfile, updateUserProfile } = useWorkout();

    const [name, setName] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [goal, setGoal] = useState<any>('General Fitness');

    useEffect(() => {
        if (userProfile) {
            setName(userProfile.name);
            setHeight(userProfile.height);
            setWeight(userProfile.weight);
            setGoal(userProfile.goal);
        }
    }, [userProfile]);

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter your name');
            return;
        }
        await updateUserProfile({
            name,
            height,
            weight,
            goal,
            age: userProfile?.age || '25'
        });
        Alert.alert('Success', 'Profile updated!');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Your Profile</Text>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter your name"
                        placeholderTextColor={Colors.textSecondary}
                    />
                </View>

                <View style={styles.row}>
                    <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                        <Text style={styles.label}>Height (in)</Text>
                        <TextInput
                            style={styles.input}
                            value={height}
                            onChangeText={setHeight}
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor={Colors.textSecondary}
                        />
                    </View>
                    <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                        <Text style={styles.label}>Weight (kg)</Text>
                        <TextInput
                            style={styles.input}
                            value={weight}
                            onChangeText={setWeight}
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor={Colors.textSecondary}
                        />
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Fitness Goal</Text>
                    <View style={styles.goalsContainer}>
                        {['Strength', 'Weight Loss', 'Endurance', 'General Fitness'].map((g) => (
                            <Pressable
                                key={g}
                                style={[styles.goalChip, goal === g && styles.goalChipActive]}
                                onPress={() => setGoal(g)}
                            >
                                <Text style={[styles.goalText, goal === g && styles.goalTextActive]}>{g}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                <Pressable style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                </Pressable>
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
        marginBottom: 32,
    },
    formGroup: {
        marginBottom: 24,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        backgroundColor: Colors.card,
        color: Colors.text,
        padding: 16,
        borderRadius: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    goalsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    goalChip: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 24,
        backgroundColor: Colors.card,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    goalChipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    goalText: {
        color: Colors.textSecondary,
    },
    goalTextActive: {
        color: Colors.white,
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: Colors.primary,
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 16,
    },
    saveButtonText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});
