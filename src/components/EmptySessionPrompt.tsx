import { Plus, ListTodo } from "lucide-react";

interface Props {
    onNew: () => void;
}

export default function EmptySessionPrompt({ onNew }: Props) {
    return (
        <div className="text-center">
            <div className="flex flex-col items-center mb-4">
                <ListTodo
                    size={64}
                    className="mb-2 text-base-content/50"
                    aria-hidden="true"
                />
            </div>
            <div className="font-bold text-lg">No session yet</div>
            <div className="mb-4 text-base-content/60">
                Create your first session to begin tracking your tasks.
            </div>
            <button
                type="button"
                className="btn btn-success btn-lg gap-2"
                onClick={onNew}
                aria-label="New Session"
            >
                <Plus size={20} title="New Session" aria-hidden="true" /> New Session
            </button>
        </div>
    );
}
