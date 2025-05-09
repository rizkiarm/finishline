import { useEffect, useState } from "preact/hooks";
import type { SessionData } from "../types";

export function useSessionTimer(session: SessionData | null) {
    const [running, setRunning] = useState(false);
    const [paused, setPaused] = useState(false);
    const [intervalStart, setIntervalStart] = useState<number | null>(null);
    const [pauseStart, setPauseStart] = useState<number | null>(null);
    const [totalPausedTime, setTotalPausedTime] = useState(0);
    const [taskTime, setTaskTime] = useState(0);

    // Update timer
    useEffect(() => {
        if (
            !session ||
            !session.name ||
            !running ||
            session.tasks.length >= session.itemCount ||
            intervalStart === null
        ) {
            setTaskTime(0);
            return;
        }
        function updateTaskTime() {
            let now = Date.now();
            let effectivePaused = paused && pauseStart ? now - pauseStart : 0;
            if (intervalStart === null) {
                setTaskTime(0);
                return;
            }
            let elapsed = now - intervalStart - totalPausedTime - effectivePaused;
            setTaskTime(Math.max(0, Math.floor(elapsed / 1000)));
        }
        if (paused) {
            updateTaskTime();
            return;
        }
        updateTaskTime();
        const id = setInterval(updateTaskTime, 200);
        return () => clearInterval(id);
    }, [session, running, paused, intervalStart, pauseStart, totalPausedTime]);

    // Helper for resetting timer
    function resetTimer() {
        setRunning(false);
        setPaused(false);
        setPauseStart(null);
        setIntervalStart(null);
        setTotalPausedTime(0);
        setTaskTime(0);
    }

    return {
        running,
        setRunning,
        paused,
        setPaused,
        intervalStart,
        setIntervalStart,
        pauseStart,
        setPauseStart,
        totalPausedTime,
        setTotalPausedTime,
        taskTime,
        setTaskTime,
        resetTimer,
    };
}
