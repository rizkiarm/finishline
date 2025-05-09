import { Pencil, FileDown } from "lucide-react";

interface Props {
    name: string;
    onStartEdit: () => void;
    onExport: () => void;
}

export default function SessionHeader({ name, onStartEdit, onExport }: Props) {
    return (
        <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="flex-grow text-lg font-semibold truncate" title={name}>
                {name}
            </span>
            <button
                type="button"
                className="btn btn-xs btn-outline"
                onClick={onStartEdit}
                title="Edit session"
                aria-label="Edit session"
            >
                <Pencil size={16} className="mr-1" aria-hidden="true" />
                Edit
            </button>
            <button
                type="button"
                className="btn btn-xs btn-outline"
                onClick={onExport}
                title="Export CSV"
                aria-label="Export session as CSV"
            >
                <FileDown size={16} className="mr-1" aria-hidden="true" />
                Export
            </button>
        </div>
    );
}
