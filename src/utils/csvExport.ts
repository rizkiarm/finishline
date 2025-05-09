import { formatDateTime } from "./format";
import type { SessionData } from "../types";

export function exportSessionCSV(session: SessionData) {
    let csv = "Task,Time Taken (s),Task DateTime\n";
    session.tasks.forEach((task, idx) => {
        let dt = task.datetime ? new Date(task.datetime) : "";
        csv += `${idx + 1},${typeof task.time === "number" ? task.time : ""},${formatDateTime(dt)}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (session.name || "tasks") + ".csv";
    a.click();
    URL.revokeObjectURL(url);
}
