import { formatTime } from "../utils/format";
import { Clock, History, ListChecks } from "lucide-react";

interface Props {
    taskTime: number;
    done: number;
    total: number;
    avg: number;
}

export default function SessionStats({ taskTime, done, total, avg }: Props) {
    return (
        <div
            className="stats stats-vertical sm:stats-horizontal w-full mb-2 shadow"
            aria-live="polite"
        >
            <div className="stat">
                <div className="stat-figure text-info">
                    <Clock size={20} aria-hidden="true" />
                </div>
                <div className="stat-title">Current</div>
                <div className="stat-value text-base">{formatTime(taskTime)}</div>
            </div>
            <div className="stat">
                <div className="stat-figure text-warning">
                    <History size={20} aria-hidden="true" />
                </div>
                <div className="stat-title">Average</div>
                <div className="stat-value text-base">{formatTime(avg)}</div>
            </div>
            <div className="stat">
                <div className="stat-figure text-success">
                    <ListChecks size={20} aria-hidden="true" />
                </div>
                <div className="stat-title">Completed</div>
                <div className="stat-value text-base">
                    {done}/{total}
                </div>
            </div>
        </div>
    );
}
