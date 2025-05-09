import type { SessionData } from "../types";

export function defaultSession(): SessionData {
    return {
        name: "",
        itemCount: 1,
        tasks: [],
        deadline: "",
        undo: [],
        redo: [],
    };
}
