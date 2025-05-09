import SessionHeader from "./SessionHeader";
import SessionControls from "./SessionControls";
import SessionStats from "./SessionStats";
import SessionDeadlineAlert from "./SessionDeadlineAlert";
import SessionEtaAlert from "./SessionEtaAlert";
import type { SessionData } from "../types";

interface Props {
    session: SessionData;
    onStartEdit: () => void;
    onExport: () => void;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    onTask: () => void;
    onStart: () => void;
    onPause: () => void;
    taskTime: number;
    running: boolean;
    paused: boolean;
    avg: number;
    eta: number;
}

export default function SessionPanel({
    session,
    onStartEdit,
    onExport,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    onTask,
    onStart,
    onPause,
    taskTime,
    running,
    paused,
    avg,
    eta,
}: Props) {
    const done = session.tasks.length;
    const total = Math.max(1, session.itemCount);

    const showEta = eta > 0 && done < total;
    const showDeadline = !!session.deadline;

    return (
        <div className="flex flex-col gap-2">
            <SessionHeader
                name={session.name}
                onStartEdit={onStartEdit}
                onExport={onExport}
            />
            <SessionControls
                running={running}
                paused={paused}
                done={done}
                total={total}
                onStart={onStart}
                onPause={onPause}
                onTask={onTask}
                onUndo={onUndo}
                onRedo={onRedo}
                canUndo={canUndo}
                canRedo={canRedo}
            />
            <SessionStats taskTime={taskTime} done={done} total={total} avg={avg} />
            {showEta && (
                <SessionEtaAlert
                    eta={eta}
                    running={running}
                    done={done}
                    total={total}
                />
            )}
            {showDeadline && (
                <SessionDeadlineAlert deadline={session.deadline as string} />
            )}
        </div>
    );
}
