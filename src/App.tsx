import { useState } from "preact/hooks";
import Navbar from "./components/Navbar";
import EmptySessionPrompt from "./components/EmptySessionPrompt";
import Modal from "./components/Modal";
import SessionEditForm from "./components/SessionEditForm";
import SessionListModal from "./components/SessionListModal";
import ProgressBar from "./components/ProgressBar";
import Alert from "./components/Alert";
import SessionPanel from "./components/SessionPanel";
import TaskChart from "./components/TaskChart";
import { useSessionState } from "./hooks/useSessionState";
import { useSessionTimer } from "./hooks/useSessionTimer";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { exportSessionCSV } from "./utils/csvExport";

export default function App() {
    // --- App State ---

    // Session-related state and handlers
    const {
        sessions,
        session,
        setSession,
        setSessions,
        doSaveEdit,
        doDeleteSession,
        doLoadSession,
        switchSession,
    } = useSessionState();

    // Timer/task-related state and handlers
    const {
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
    } = useSessionTimer(session);

    // UI State
    const [editing, setEditing] = useState(false);
    const [editMode, setEditMode] = useState<"edit" | "new">("edit");
    const [showList, setShowList] = useState(false);

    // --- Keyboard shortcuts ---
    useKeyboardShortcuts({
        session,
        editing,
        isModalOpen: editing || showList,
        running,
        paused,
        doTask,
        doUndo,
        doRedo,
        openEdit: (mode: "edit" | "new") => {
            setEditMode(mode);
            setEditing(true);
        },
        doPause,
        doStart,
    });

    // --- Session logic handlers (timing and task logic) ---
    function openEdit(mode: "edit" | "new") {
        setEditMode(mode);
        setEditing(true);
    }
    function closeEdit() {
        setEditing(false);
    }
    function doTask() {
        if (!session || !running || paused || session.tasks.length >= session.itemCount)
            return;
        let undoArr = session.undo ? session.undo.slice() : [];
        undoArr.push(session.tasks.slice());
        if (undoArr.length > 100) undoArr.shift();
        const now = Date.now();
        const base = intervalStart ?? now;
        const elapsed = now - base - totalPausedTime;
        const taskSecs = Math.max(0, Math.floor(elapsed / 1000));
        let newTasks = session.tasks.concat([{ time: taskSecs, datetime: now }]);
        let newSession = {
            ...session,
            tasks: newTasks,
            undo: undoArr,
            redo: [],
        };
        const updatedSessions = {
            ...sessions,
            [session.name]: newSession,
        };
        setSessions(updatedSessions);
        setSession(newSession);

        if (newTasks.length < session.itemCount) {
            setIntervalStart(Date.now());
            setTotalPausedTime(0);
            setPaused(false);
            setPauseStart(null);
            setRunning(true);
        } else {
            resetTimer();
        }
        setTaskTime(0);
    }
    function doStart() {
        if (!session) return;
        if (!running) {
            setRunning(true);
            setIntervalStart(Date.now());
            setTotalPausedTime(0);
            setPaused(false);
            setPauseStart(null);
        } else if (paused && pauseStart) {
            setTotalPausedTime(totalPausedTime + (Date.now() - pauseStart));
            setPaused(false);
            setPauseStart(null);
        }
    }
    function doPause() {
        if (!paused && running) {
            setPaused(true);
            setPauseStart(Date.now());
        }
    }
    function doUndo() {
        if (!session || !session.undo?.length) return;
        let undoArr = session.undo.slice();
        let redoArr = session.redo ? session.redo.slice() : [];
        redoArr.push(session.tasks.slice());
        let prevTasks = undoArr.pop();
        let newSession = {
            ...session,
            tasks: prevTasks!,
            undo: undoArr,
            redo: redoArr,
        };
        const updatedSessions = {
            ...sessions,
            [session.name]: newSession,
        };
        setSessions(updatedSessions);
        switchSession(newSession);
        resetTimer();
    }
    function doRedo() {
        if (!session || !session.redo?.length) return;
        let redoArr = session.redo.slice();
        let undoArr = session.undo ? session.undo.slice() : [];
        undoArr.push(session.tasks.slice());
        let nextTasks = redoArr.pop();
        let newSession = {
            ...session,
            tasks: nextTasks!,
            undo: undoArr,
            redo: redoArr,
        };
        const updatedSessions = {
            ...sessions,
            [session.name]: newSession,
        };
        setSessions(updatedSessions);
        switchSession(newSession);
        resetTimer();
    }
    function doExportCSV() {
        if (!session) return;
        exportSessionCSV(session);
    }

    // Derived values
    const done = session?.tasks?.length || 0;
    const total = Math.max(1, session?.itemCount || 1);
    const validTimes =
        session?.tasks
            ?.map((t) => (typeof t.time === "number" ? t.time : NaN))
            .filter((x) => x > 0) || [];
    const avg = validTimes.length
        ? validTimes.reduce((a, b) => a + b, 0) / validTimes.length
        : NaN;
    const eta = (session?.itemCount! - done) * (avg || 0);
    const progress = Math.min(100, (done / total) * 100);

    return (
        <>
            <Navbar
                onStartNew={() => openEdit("new")}
                onShowList={() => setShowList(true)}
            />
            <div className="container max-w-7xl mx-auto px-3">
                <div className="mt-4 mb-3">
                    {session?.name && (
                        <ProgressBar
                            progress={progress}
                            label={session.name}
                            color="success"
                            text={session.name ? Math.round(progress) + "%" : ""}
                        />
                    )}
                    {session?.name && session.tasks.length >= session.itemCount && (
                        <Alert color="success" className="alert-outline">
                            All tasks complete!
                        </Alert>
                    )}
                </div>
                <div
                    className={
                        "grid grid-cols-1 " +
                        (session?.name ? "lg:grid-cols-2" : "lg:grid-cols-1") +
                        " gap-4"
                    }
                >
                    <div>
                        <div className="bg-base-100 rounded-box shadow p-4 flex flex-col gap-2">
                            {!session?.name && (
                                <EmptySessionPrompt onNew={() => openEdit("new")} />
                            )}
                            {session?.name && (
                                <SessionPanel
                                    session={session}
                                    onStartEdit={() => openEdit("edit")}
                                    onExport={doExportCSV}
                                    onUndo={doUndo}
                                    onRedo={doRedo}
                                    canUndo={!!session.undo?.length}
                                    canRedo={!!session.redo?.length}
                                    onTask={doTask}
                                    onStart={doStart}
                                    onPause={doPause}
                                    taskTime={taskTime}
                                    running={running}
                                    paused={paused}
                                    avg={avg}
                                    eta={eta}
                                />
                            )}
                            <Modal
                                open={editing}
                                onClose={closeEdit}
                                title={
                                    editMode === "edit" ? "Edit Session" : "New Session"
                                }
                            >
                                <SessionEditForm
                                    initial={
                                        editMode === "edit"
                                            ? session || undefined
                                            : undefined
                                    }
                                    sessions={sessions}
                                    editing={editMode === "edit"}
                                    onSave={(data: any) => {
                                        const ok = doSaveEdit(data, editMode, session);
                                        if (ok) {
                                            setEditing(false);
                                            resetTimer();
                                        }
                                    }}
                                    onCancel={() => {
                                        setEditing(false);
                                    }}
                                />
                            </Modal>
                            <SessionListModal
                                open={showList}
                                sessions={sessions}
                                onLoad={(name) => {
                                    doLoadSession(name);
                                    setShowList(false);
                                }}
                                onDelete={doDeleteSession}
                                onClose={() => setShowList(false)}
                            />
                        </div>
                    </div>
                    {session?.name && (
                        <div>
                            <div className="bg-base-100 rounded-box shadow p-4 flex flex-col h-full justify-between">
                                <TaskChart tasks={session.tasks} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
