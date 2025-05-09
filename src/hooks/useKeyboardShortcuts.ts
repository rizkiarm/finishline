import { useEffect } from "preact/hooks";

export function useKeyboardShortcuts({
    session,
    editing,
    isModalOpen,
    running,
    paused,
    doTask,
    doUndo,
    doRedo,
    openEdit,
    doPause,
    doStart,
}: {
    session: any;
    editing: boolean;
    isModalOpen: boolean;
    running: boolean;
    paused: boolean;
    doTask: () => void;
    doUndo: () => void;
    doRedo: () => void;
    // eslint-disable-next-line no-unused-vars
    openEdit: (mode: "edit" | "new") => void;
    doPause: () => void;
    doStart: () => void;
}) {
    useEffect(() => {
        function handler(e: KeyboardEvent) {
            if (!session || editing || isModalOpen) return;
            if (e.code === "Space") {
                e.preventDefault();
                if (running && !paused && session.tasks.length < session.itemCount)
                    doTask();
            }
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
                e.preventDefault();
                doUndo();
            }
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
                e.preventDefault();
                doRedo();
            }
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
                e.preventDefault();
                openEdit("edit");
            }
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "n") {
                e.preventDefault();
                openEdit("new");
            }
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
                e.preventDefault();
                if (running && !paused && session.tasks.length < session.itemCount)
                    doPause();
                else if (
                    (!running || paused) &&
                    session.tasks.length < session.itemCount
                )
                    doStart();
            }
        }
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    });
}
