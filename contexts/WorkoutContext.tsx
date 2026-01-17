import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { PREDEFINED_ROUTINES } from '../constants/Data';
import { UserProfile, WorkoutRoutine, WorkoutSession } from '../types';

interface WorkoutContextType {
    routines: WorkoutRoutine[];
    history: WorkoutSession[];
    userProfile: UserProfile | null;
    activeWorkout: WorkoutSession | null;
    startWorkout: (routineId: string) => void;
    finishWorkout: (session: WorkoutSession) => Promise<void>;
    cancelWorkout: () => void;
    updateUserProfile: (profile: UserProfile) => Promise<void>;
    addRoutine: (routine: WorkoutRoutine) => Promise<void>;
    deleteRoutine: (id: string) => Promise<void>;
    clearHistory: () => Promise<void>;
    isLoading: boolean;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

const STORAGE_KEYS = {
    ROUTINES: '@fittrack_routines',
    HISTORY: '@fittrack_history',
    PROFILE: '@fittrack_profile',
};

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [routines, setRoutines] = useState<WorkoutRoutine[]>(PREDEFINED_ROUTINES);
    const [history, setHistory] = useState<WorkoutSession[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [activeWorkout, setActiveWorkout] = useState<WorkoutSession | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [storedHistory, storedProfile] = await Promise.all([
                AsyncStorage.getItem(STORAGE_KEYS.HISTORY),
                AsyncStorage.getItem(STORAGE_KEYS.PROFILE),
            ]);

            if (storedHistory) setHistory(JSON.parse(storedHistory));
            if (storedProfile) setUserProfile(JSON.parse(storedProfile));

            const storedRoutines = await AsyncStorage.getItem(STORAGE_KEYS.ROUTINES);
            if (storedRoutines) {
                const parsedRoutines = JSON.parse(storedRoutines);
                // Merge stored routines with predefined ones (avoiding duplicates if logic requires, but simplest is just appending user ones or replacing if we stored all)
                // Here we assume we only store CUSTOM routines or potentially full state. 
                // A safer approach for this simple app: Load stored custom routines and append to PREDEFINED.
                // However, the state `routines` is initialized with PREDEFINED.
                // Let's assume we treat the stored routines as the "source of truth for custom ones"
                // or we just replace the state if we decide to save ALL routines.

                // Better approach: storedRoutines contains ONLY custom routines or ALL?
                // If we save everything, we can just setRoutines.
                // Let's assume we save ALL routines to persist them.
                setRoutines(parsedRoutines);
            }
        } catch (e) {
            console.error('Failed to load data', e);
        } finally {
            setIsLoading(false);
        }
    };

    const startWorkout = (routineId: string) => {
        const routine = routines.find(r => r.id === routineId);
        if (!routine) return;

        const newSession: WorkoutSession = {
            id: Date.now().toString(),
            routineId: routine.id,
            routineName: routine.name,
            startTime: new Date().toISOString(),
            durationSeconds: 0,
            exercises: routine.exercises.map(ex => ({
                ...ex,
                sets: Array(ex.defaultSets || 3).fill(null).map((_, i) => ({
                    id: `${ex.id}_set_${i}`,
                    reps: ex.defaultReps || 10,
                    weight: 0,
                    completed: false,
                })),
            })),
            completed: false,
        };

        setActiveWorkout(newSession);
    };

    const finishWorkout = async (session: WorkoutSession) => {
        try {
            const completedSession = { ...session, endTime: new Date().toISOString(), completed: true };
            const newHistory = [completedSession, ...history];
            setHistory(newHistory);
            setActiveWorkout(null);
            await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(newHistory));
        } catch (e) {
            console.error('Failed to save workout', e);
        }
    };

    const cancelWorkout = () => {
        setActiveWorkout(null);
    };

    const updateUserProfile = async (profile: UserProfile) => {
        try {
            setUserProfile(profile);
            await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
        } catch (e) {
            console.error('Failed to save profile', e);
        }
    };

    const addRoutine = async (routine: WorkoutRoutine) => {
        try {
            setRoutines(prev => {
                const newRoutines = [...prev, routine];
                AsyncStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(newRoutines)).catch(e => console.error(e));
                return newRoutines;
            });
        } catch (e) {
            console.error('Failed to save routine', e);
        }
    };

    const deleteRoutine = async (id: string) => {
        console.log('Attempting to delete routine', id);
        try {
            // Read directly from storage to ensure we have the latest persisted data
            const storedRoutines = await AsyncStorage.getItem(STORAGE_KEYS.ROUTINES);
            let currentRoutines = storedRoutines ? JSON.parse(storedRoutines) : routines;

            // Filter out the routine to delete
            const newRoutines = currentRoutines.filter((r: WorkoutRoutine) => r.id !== id);

            console.log('Storage Deletion - Before:', currentRoutines.length, 'After:', newRoutines.length);

            // Write back to storage immediately
            await AsyncStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(newRoutines));

            // Update state to match storage
            setRoutines(newRoutines);
        } catch (e) {
            console.error('Failed to delete routine', e);
        }
    };

    const clearHistory = async () => {
        try {
            setHistory([]);
            await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify([]));
        } catch (e) {
            console.error('Failed to clear history', e);
        }
    };

    return (
        <WorkoutContext.Provider
            value={{
                routines,
                history,
                userProfile,
                activeWorkout,
                startWorkout,
                finishWorkout,
                cancelWorkout,
                updateUserProfile,
                addRoutine,
                deleteRoutine,
                clearHistory,
                isLoading,
            }}
        >
            {children}
        </WorkoutContext.Provider>
    );
};

export const useWorkout = () => {
    const context = useContext(WorkoutContext);
    if (!context) {
        throw new Error('useWorkout must be used within a WorkoutProvider');
    }
    return context;
};
