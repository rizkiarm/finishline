import { useEffect, useState } from "preact/hooks";
import type { SessionData } from "../types";
import Modal from "./Modal";
import { UploadCloud, Trash2 } from "lucide-react";

interface Props {
    open: boolean;
    sessions: Record<string, SessionData>;
    // eslint-disable-next-line no-unused-vars
    onLoad: (name: string) => void;
    // eslint-disable-next-line no-unused-vars
    onDelete: (name: string) => void;
    onClose: () => void;
}

function formatDateTime(dt: string | number) {
    const d = new Date(dt);
    return d.toLocaleString();
}

export default function SessionListModal({
    open,
    sessions,
    onLoad,
    onDelete,
    onClose,
}: Props) {
    const PAGE_SIZE = 10;
    const names = Object.keys(sessions).sort();
    const pageCount = Math.ceil(names.length / PAGE_SIZE);
    const [page, setPage] = useState(1);

    // Reset to page 1 if sessions change and page is out of range
    useEffect(() => {
        if (page > pageCount) setPage(pageCount || 1);
    }, [page, pageCount]);

    const pagedNames = names.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <Modal open={open} onClose={onClose} title="Sessions" size="3xl">
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full text-base">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Tasks</th>
                            <th>Completed</th>
                            <th>Deadline</th>
                            <th className="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pagedNames.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="text-base-content/60 text-center"
                                >
                                    No sessions.
                                </td>
                            </tr>
                        ) : (
                            pagedNames.map((n) => (
                                <tr key={n}>
                                    <td className="font-semibold">{n}</td>
                                    <td>{sessions[n].itemCount}</td>
                                    <td>{sessions[n].tasks.length}</td>
                                    <td>
                                        {sessions[n].deadline
                                            ? formatDateTime(sessions[n].deadline)
                                            : "-"}
                                    </td>
                                    <td className="flex gap-2 justify-end">
                                        <button
                                            type="button"
                                            className="btn btn-xs btn-outline btn-info"
                                            onClick={() => onLoad(n)}
                                            aria-label={`Load session "${n}"`}
                                        >
                                            <UploadCloud
                                                size={16}
                                                className="mr-1"
                                                aria-hidden="true"
                                            />
                                            Load
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-xs btn-outline btn-error"
                                            onClick={() => {
                                                if (confirm(`Delete session "${n}"?`))
                                                    onDelete(n);
                                            }}
                                            aria-label={`Delete session "${n}"`}
                                        >
                                            <Trash2
                                                size={16}
                                                className="mr-1"
                                                aria-hidden="true"
                                            />
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <div className="flex justify-between items-center mt-4">
                    <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        disabled={page === 1}
                        aria-disabled={page === 1}
                        onClick={() => setPage((p: number) => Math.max(1, p - 1))}
                    >
                        Previous
                    </button>
                    <span aria-current="page">
                        Page {page} of {pageCount || 1}
                    </span>
                    <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        disabled={page === pageCount || pageCount === 0}
                        aria-disabled={page === pageCount || pageCount === 0}
                        onClick={() =>
                            setPage((p: number) => Math.min(pageCount, p + 1))
                        }
                    >
                        Next
                    </button>
                </div>
            </div>
        </Modal>
    );
}
