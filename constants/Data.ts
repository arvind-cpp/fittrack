import { WorkoutRoutine, Exercise } from '../types';

export const EXERCISES: Record<string, Exercise> = {
    // Push
    bench_press: { id: 'bench_press', name: 'Barbell Bench Press', muscleGroup: 'Chest', equipment: 'Barbell', defaultSets: 3, defaultReps: 10, defaultRestSeconds: 90 },
    push_ups: { id: 'push_ups', name: 'Push Ups', muscleGroup: 'Chest', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 15, defaultRestSeconds: 60 },
    overhead_press: { id: 'overhead_press', name: 'Overhead Press', muscleGroup: 'Shoulders', equipment: 'Barbell', defaultSets: 3, defaultReps: 10, defaultRestSeconds: 90 },
    lateral_raises: { id: 'lateral_raises', name: 'Lateral Raises', muscleGroup: 'Shoulders', equipment: 'Dumbbells', defaultSets: 3, defaultReps: 12, defaultRestSeconds: 60 },
    tricep_dips: { id: 'tricep_dips', name: 'Tricep Dips', muscleGroup: 'Arms', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 12, defaultRestSeconds: 60 },

    // Pull
    pull_ups: { id: 'pull_ups', name: 'Pull Ups', muscleGroup: 'Back', equipment: 'Pull-up Bar', defaultSets: 3, defaultReps: 8, defaultRestSeconds: 120 },
    barbell_rows: { id: 'barbell_rows', name: 'Barbell Rows', muscleGroup: 'Back', equipment: 'Barbell', defaultSets: 3, defaultReps: 10, defaultRestSeconds: 90 },
    bicep_curls: { id: 'bicep_curls', name: 'Bicep Curls', muscleGroup: 'Arms', equipment: 'Dumbbells', defaultSets: 3, defaultReps: 12, defaultRestSeconds: 60 },
    face_pulls: { id: 'face_pulls', name: 'Face Pulls', muscleGroup: 'Shoulders', equipment: 'Cable', defaultSets: 3, defaultReps: 15, defaultRestSeconds: 60 },

    // Legs
    squats: { id: 'squats', name: 'Barbell Squats', muscleGroup: 'Legs', equipment: 'Barbell', defaultSets: 3, defaultReps: 8, defaultRestSeconds: 120 },
    deadlifts: { id: 'deadlifts', name: 'Deadlifts', muscleGroup: 'Legs', equipment: 'Barbell', defaultSets: 3, defaultReps: 5, defaultRestSeconds: 180 },
    lunges: { id: 'lunges', name: 'Walking Lunges', muscleGroup: 'Legs', equipment: 'Dumbbells', defaultSets: 3, defaultReps: 12, defaultRestSeconds: 90 },
    calf_raises: { id: 'calf_raises', name: 'Calf Raises', muscleGroup: 'Legs', equipment: 'Machine', defaultSets: 4, defaultReps: 15, defaultRestSeconds: 60 },

    // Core / Cardio
    plank: { id: 'plank', name: 'Plank', muscleGroup: 'Abs', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 60, defaultRestSeconds: 60 },
    crunches: { id: 'crunches', name: 'Crunches', muscleGroup: 'Abs', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 20, defaultRestSeconds: 45 },
    running: { id: 'running', name: 'Running', muscleGroup: 'Cardio', equipment: 'None', defaultSets: 1, defaultReps: 20, defaultRestSeconds: 0 },
    burpees: { id: 'burpees', name: 'Burpees', muscleGroup: 'Full Body', equipment: 'Bodyweight', defaultSets: 3, defaultReps: 10, defaultRestSeconds: 60 },
};

export const PREDEFINED_ROUTINES: WorkoutRoutine[] = [
    {
        id: 'beginner_full_body',
        name: 'Beginner Full Body',
        description: 'A great start for beginners hitting all major muscle groups.',
        difficulty: 'Beginner',
        estimatedDurationMin: 45,
        exercises: [
            EXERCISES.squats,
            EXERCISES.push_ups,
            EXERCISES.barbell_rows,
            EXERCISES.overhead_press,
            EXERCISES.plank,
        ],
    },
    {
        id: 'push_day',
        name: 'Push Day (Chest/Shoulders/Triceps)',
        description: 'Focus on pushing movements.',
        difficulty: 'Intermediate',
        estimatedDurationMin: 60,
        exercises: [
            EXERCISES.bench_press,
            EXERCISES.overhead_press,
            EXERCISES.tricep_dips,
            EXERCISES.lateral_raises,
            EXERCISES.push_ups,
        ],
    },
    {
        id: 'pull_day',
        name: 'Pull Day (Back/Biceps)',
        description: 'Focus on pulling movements.',
        difficulty: 'Intermediate',
        estimatedDurationMin: 60,
        exercises: [
            EXERCISES.deadlifts,
            EXERCISES.pull_ups,
            EXERCISES.barbell_rows,
            EXERCISES.bicep_curls,
            EXERCISES.face_pulls,
        ],
    },
    {
        id: 'leg_day',
        name: 'Leg Day',
        description: 'Focus on lower body strength.',
        difficulty: 'Intermediate',
        estimatedDurationMin: 60,
        exercises: [
            EXERCISES.squats,
            EXERCISES.lunges,
            EXERCISES.deadlifts,
            EXERCISES.calf_raises,
        ],
    },
    {
        id: 'hiit_burn',
        name: 'HIIT Fat Burn',
        description: 'High intensity interval training.',
        difficulty: 'Advanced',
        estimatedDurationMin: 20,
        exercises: [
            EXERCISES.burpees,
            EXERCISES.push_ups,
            EXERCISES.squats,
            EXERCISES.plank,
            EXERCISES.running,
        ],
    },
];
