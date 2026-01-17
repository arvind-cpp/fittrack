export type MuscleGroup = 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Abs' | 'Cardio' | 'Full Body';

export interface Exercise {
    id: string;
    name: string;
    muscleGroup: MuscleGroup;
    equipment?: string;
    defaultSets?: number;
    defaultReps?: number;
    defaultRestSeconds?: number;
}

export interface Set {
    id: string;
    reps: number;
    weight: number;
    completed: boolean;
}

export interface WorkoutExercise extends Exercise {
    sets: Set[];
}

export interface WorkoutRoutine {
    id: string;
    name: string;
    description: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    exercises: Exercise[];
    estimatedDurationMin: number;
    image?: any; // For local require images
}

export interface WorkoutSession {
    id: string;
    routineId: string;
    routineName: string;
    startTime: string; // ISO String
    endTime?: string; // ISO String
    durationSeconds: number;
    exercises: WorkoutExercise[];
    completed: boolean;
}

export interface UserProfile {
    name: string;
    age: string;
    height: string; // inches
    weight: string; // kg
    goal: 'Strength' | 'Weight Loss' | 'Endurance' | 'General Fitness';
}
