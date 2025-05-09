export type Theme = "light" | "dark";

export type Color =
    | "neutral"
    | "primary"
    | "secondary"
    | "accent"
    | "info"
    | "success"
    | "warning"
    | "error";

export interface Task {
    time: number;
    datetime: number;
}
export interface SessionData {
    name: string;
    itemCount: number;
    tasks: Task[];
    deadline?: string;
    undo?: Task[][];
    redo?: Task[][];
}

export type Aggregation = "hourly" | "daily" | "weekly";
export type ValueType = "count" | "totalDuration" | "averageDuration";
