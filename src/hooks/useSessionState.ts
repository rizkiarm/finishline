import { useState, useEffect } from "preact/hooks";
import { useStorage } from "./useStorage";
import { STORAGE_KEY, LAST_SESSION_KEY } from "../constants";
import type { SessionData } from "../types";
import { defaultSession } from "../utils/sessionHelpers";

export function useSessionState() {
    // Sessions are always synced with storage backend
    const [sessions, setSessions] = useStorage<Record<string, SessionData>>(
        STORAGE_KEY,
        {},
    );
    const [lastSessionName, setLastSessionName] = useStorage<string | null>(
        LAST_SESSION_KEY,
        null,
    );

    // Which session to focus on after sessions update
    const [pendingSessionName, setPendingSessionName] = useState<string | null>(null);

    // On first load, find last session or first
    const [session, setSession] = useState<SessionData | null>(() => {
        const all = sessions;
        const last = lastSessionName;
        if (last && all[last]) return all[last];
        const keys = Object.keys(all);
        return keys.length > 0 ? all[keys[0]] : null;
    });

    // When sessions, lastSessionName or pendingSessionName change, update session if needed
    useEffect(() => {
        const all = sessions;
        const last = pendingSessionName || lastSessionName;
        if (last && all[last]) {
            setSession(all[last]);
            setLastSessionName(last);
            setPendingSessionName(null); // clear the pending session
        } else {
            const keys = Object.keys(all);
            setSession(keys.length > 0 ? all[keys[0]] : null);
        }
    }, [sessions, lastSessionName, pendingSessionName]);

    function switchSession(targetSession: SessionData | null) {
        const allSessions = sessions;
        if (targetSession && targetSession.name && !allSessions[targetSession.name]) {
            alert(
                `Session "${targetSession.name}" does not exist anymore. Will load another session if available.`,
            );
            targetSession = null;
        }
        let newSession = targetSession;
        const keys = Object.keys(allSessions);
        if (!newSession || !newSession.name) {
            newSession = keys.length > 0 ? allSessions[keys[0]] : null;
            setLastSessionName(newSession?.name || null);
        } else {
            setLastSessionName(newSession.name);
        }
        setSession(newSession);
    }

    function doSaveEdit(
        data: any,
        editMode: "edit" | "new",
        currentSession?: SessionData | null,
    ) {
        if (editMode === "edit") {
            if (data.name !== currentSession?.name && sessions[data.name]) return false;
            let newSession = { ...currentSession!, ...data };
            let sessCopy = { ...sessions };
            if (currentSession && data.name !== currentSession.name)
                delete sessCopy[currentSession.name];
            sessCopy[data.name] = newSession;
            setSessions(sessCopy);
            setPendingSessionName(newSession.name); // Switch after update!
        } else {
            if (sessions[data.name]) return false;
            let newSession: SessionData = { ...defaultSession(), ...data };
            if (data.currentTask > 1) {
                const now = Date.now();
                newSession.tasks = [];
                for (let i = 0; i < data.currentTask - 1; ++i) {
                    newSession.tasks.push({
                        time: data.avgTime,
                        datetime:
                            now - (data.currentTask - 2 - i) * data.avgTime * 1000,
                    });
                }
            }
            delete (newSession as any).avgTime;
            delete (newSession as any).currentTask;
            const updated = {
                ...sessions,
                [data.name]: newSession,
            };
            setSessions(updated);
            setPendingSessionName(newSession.name); // Switch after update!
        }
        return true;
    }

    function doDeleteSession(name: string) {
        let sessCopy = { ...sessions };
        delete sessCopy[name];
        setSessions(sessCopy);
        if (session && session.name === name) setPendingSessionName(null);
    }
    function doLoadSession(name: string) {
        setPendingSessionName(name);
    }

    return {
        sessions,
        session,
        setSession,
        setSessions,
        doSaveEdit,
        doDeleteSession,
        doLoadSession,
        switchSession,
    };
}
