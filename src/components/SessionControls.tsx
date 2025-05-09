import { Play, Pause, Flag, Undo2, Redo2 } from "lucide-react";

interface Props {
    running: boolean;
    paused: boolean;
    done: number;
    total: number;
    onStart: () => void;
    onPause: () => void;
    onTask: () => void;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

export default function SessionControls({
    running,
    paused,
    done,
    total,
    onStart,
    onPause,
    onTask,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
}: Props) {
    const canStart = (!running || paused) && done < total;
    const canPause = running && !paused && done < total;
    const canComplete = running && !paused && done < total;

    return (
        <div className="flex flex-row gap-2 mb-2">
            {canStart && (
                <button
                    type="button"
                    className="btn btn-sm btn-success flex-1"
                    onClick={onStart}
                    aria-label="Start session"
                >
                    <Play size={16} className="mr-2" aria-hidden="true" />
                    Start
                </button>
            )}
            {canPause && (
                <button
                    type="button"
                    className="btn btn-sm btn-error flex-1"
                    onClick={onPause}
                    aria-label="Pause session"
                >
                    <Pause size={16} className="mr-2" aria-hidden="true" />
                    Pause
                </button>
            )}
            <button
                type="button"
                className={`btn btn-sm flex-1 ${canComplete ? "btn-primary" : "btn-disabled"}`}
                disabled={!canComplete}
                onClick={onTask}
                aria-label="Complete task"
            >
                <Flag size={16} className="mr-2" aria-hidden="true" />
                Complete Task
            </button>
            <button
                type="button"
                className="btn btn-xs btn-neutral"
                onClick={onUndo}
                disabled={!canUndo}
                aria-label="Undo"
            >
                <Undo2 size={16} className="mr-2" aria-hidden="true" />
                Undo
            </button>
            <button
                type="button"
                className="btn btn-xs btn-neutral"
                onClick={onRedo}
                disabled={!canRedo}
                aria-label="Redo"
            >
                <Redo2 size={16} className="mr-2" aria-hidden="true" />
                Redo
            </button>
        </div>
    );
}
