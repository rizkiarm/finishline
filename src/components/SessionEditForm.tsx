import { useState, useEffect } from "preact/hooks";
import type { SessionData } from "../types";

interface SessionEditFormProps {
    initial?: SessionData;
    sessions: Record<string, SessionData>;
    editing: boolean;
    // eslint-disable-next-line no-unused-vars
    onSave: (data: SessionData | any) => void;
    onCancel: () => void;
}

export default function SessionEditForm({
    initial,
    sessions,
    editing,
    onSave,
    onCancel,
}: SessionEditFormProps) {
    const [name, setName] = useState(initial?.name ?? "");
    const [itemCount, setItemCount] = useState(initial?.itemCount ?? 1);
    const [currentTask, setCurrentTask] = useState(1);
    const [avgTime, setAvgTime] = useState("");
    const [deadline, setDeadline] = useState(initial?.deadline ?? "");
    const [err, setErr] = useState("");

    useEffect(() => {
        setName(initial?.name ?? "");
        setItemCount(initial?.itemCount ?? 1);
        setCurrentTask(1);
        setAvgTime("");
        setDeadline(initial?.deadline ?? "");
        setErr("");
    }, [initial, editing]);

    function save(e: Event) {
        e.preventDefault();
        const n = name.trim();
        if (!n) return setErr("Name required");
        if (!/^[\w\s-]+$/.test(n))
            return setErr("Name: only letters, digits, space, - or _");
        if ((!editing || n !== initial?.name) && sessions[n])
            return setErr("Session with this name exists.");
        if (!Number.isInteger(Number(itemCount)) || Number(itemCount) < 1)
            return setErr("Tasks: must be integer ≥1.");
        if (!editing) {
            if (
                !Number.isInteger(Number(currentTask)) ||
                Number(currentTask) < 1 ||
                Number(currentTask) > Number(itemCount)
            )
                return setErr("Current Task: must be between 1 and Number of Tasks.");
            if (
                Number(currentTask) > 1 &&
                (isNaN(Number(avgTime)) || Number(avgTime) <= 0)
            )
                return setErr(
                    "Average time must be positive for pre-filling previous tasks.",
                );
        }
        setErr("");
        if (!editing) {
            onSave({
                name: n,
                itemCount: Number(itemCount),
                currentTask: Number(currentTask),
                avgTime: Number(avgTime),
                deadline,
            });
        } else {
            onSave({
                name: n,
                itemCount: Number(itemCount),
                deadline,
            });
        }
    }

    // IDs for accessibility
    const nameId = "input-session-name";
    const taskCountId = "input-task-count";
    const currentTaskId = "input-current-task";
    const avgTimeId = "input-avg-time";
    const deadlineId = "input-deadline";
    const errId = "session-form-error";

    return (
        <form onSubmit={save} className="flex flex-col gap-4" noValidate>
            <div className="form-control w-full">
                <label htmlFor={nameId} className="label label-text">
                    Session Name
                </label>
                <input
                    id={nameId}
                    className="input input-bordered w-full bg-base-100 text-base-content"
                    value={name}
                    onInput={(e) => setName((e.target as HTMLInputElement).value)}
                    autoFocus
                    autoComplete="off"
                    aria-invalid={!!err}
                    aria-describedby={err ? errId : undefined}
                />
            </div>
            <div className="form-control w-full">
                <label htmlFor={taskCountId} className="label label-text">
                    Number of Tasks
                </label>
                <input
                    id={taskCountId}
                    className="input input-bordered w-full bg-base-100 text-base-content"
                    type="number"
                    min="1"
                    step="1"
                    value={itemCount}
                    onInput={(e) => {
                        const val = Number((e.target as HTMLInputElement).value);
                        setItemCount(val);
                        if (!editing && currentTask > val) {
                            setCurrentTask(val);
                            setAvgTime("");
                        }
                    }}
                />
            </div>
            {!editing && (
                <>
                    <div className="form-control w-full">
                        <label htmlFor={currentTaskId} className="label label-text">
                            Current Task Number (start from)
                        </label>
                        <input
                            id={currentTaskId}
                            className="input input-bordered w-full bg-base-100 text-base-content"
                            type="number"
                            min="1"
                            max={itemCount}
                            step="1"
                            value={currentTask}
                            onInput={(e) => {
                                const val = Number(
                                    (e.target as HTMLInputElement).value,
                                );
                                setCurrentTask(val);
                                // Clear avgTime if currentTask <= 1
                                if (val <= 1) setAvgTime("");
                            }}
                        />
                    </div>
                    <div className="form-control w-full">
                        <label htmlFor={avgTimeId} className="label label-text">
                            Average Time for Previous Tasks (seconds)
                        </label>
                        <input
                            id={avgTimeId}
                            className="input input-bordered w-full bg-base-100 text-base-content"
                            type="number"
                            min="0.01"
                            step="any"
                            value={avgTime}
                            onInput={(e) =>
                                setAvgTime((e.target as HTMLInputElement).value)
                            }
                            placeholder="E.g. 75.5"
                            disabled={Number(currentTask) <= 1}
                        />
                    </div>
                </>
            )}
            <div className="form-control w-full">
                <label htmlFor={deadlineId} className="label label-text">
                    Deadline (optional)
                </label>
                <input
                    id={deadlineId}
                    className="input input-bordered w-full bg-base-100 text-base-content"
                    type="datetime-local"
                    value={deadline}
                    onInput={(e) => setDeadline((e.target as HTMLInputElement).value)}
                />
            </div>
            {err && (
                <div id={errId} className="text-error text-sm mt-2">
                    {err}
                </div>
            )}
            <div className="flex justify-end gap-2 mt-2">
                <button type="submit" className="btn btn-neutral">
                    {editing ? "Save" : "Create"}
                </button>
                <button type="button" className="btn btn-outline" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </form>
    );
}
