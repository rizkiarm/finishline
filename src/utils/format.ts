// Format a duration in seconds into a string like "1h 3m 2s"
export function formatTime(sec: number): string {
    if (isNaN(sec) || sec < 0) return "-";
    sec = Math.round(sec);
    const d = Math.floor(sec / 86400);
    sec %= 86400;
    const h = Math.floor(sec / 3600);
    sec %= 3600;
    const m = Math.floor(sec / 60);
    sec %= 60;
    return [d && `${d}d`, (h || d) && `${h}h`, (m || h || d) && `${m}m`, `${sec}s`]
        .filter(Boolean)
        .join(" ");
}

// Format a date string or Date instance into "Mon, 9 Sep 2024 14:05"
export function formatDateTime(dt: string | number | Date): string {
    if (!dt || isNaN(new Date(dt).getTime())) return "";
    const d = new Date(dt);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

// Get {d, h, m, s} breakdown from seconds
export function getTimeParts(totalSeconds: number) {
    let d = 0,
        h = 0,
        m = 0,
        s = 0;
    if (totalSeconds >= 0) {
        let sec = Math.floor(totalSeconds);
        d = Math.floor(sec / 86400);
        sec %= 86400;
        h = Math.floor(sec / 3600);
        sec %= 3600;
        m = Math.floor(sec / 60);
        sec %= 60;
        s = sec;
    }
    return { d, h, m, s };
}
