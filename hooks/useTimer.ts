import { useState, useEffect, useRef } from 'react';

export const useTimer = (initialTime: number = 0) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsRunning(false);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning, timeLeft]);

    const start = (duration?: number) => {
        if (duration) setTimeLeft(duration);
        setIsRunning(true);
    };

    const pause = () => {
        setIsRunning(false);
    };

    const resume = () => {
        if (timeLeft > 0) setIsRunning(true);
    };

    const stop = () => {
        setIsRunning(false);
        setTimeLeft(0);
    };

    const addTime = (seconds: number) => {
        setTimeLeft((prev) => prev + seconds);
    };

    return { timeLeft, isRunning, start, pause, resume, stop, addTime };
};
