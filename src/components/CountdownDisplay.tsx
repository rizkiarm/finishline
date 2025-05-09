import type { JSX } from "preact";
import { getTimeParts } from "../utils/format";

interface CountdownDisplayProps {
    secsLeft: number;
    expiredText?: string;
    className?: string;
}

function CountdownPart({ value, label }: { value: number; label: string }) {
    return (
        <span className="flex items-center gap-1">
            <span className="countdown font-bold">
                <span style={{ "--value": value }}></span>
            </span>
            <span>{label}</span>
        </span>
    );
}

export default function CountdownDisplay({
    secsLeft,
    expiredText = "Expired",
    className = "",
}: CountdownDisplayProps) {
    const expired = secsLeft < 0;
    const { d, h, m, s } = getTimeParts(secsLeft);

    let parts: JSX.Element[] = [];
    if (d) parts.push(<CountdownPart value={d} label="days" />);
    if (d || h) parts.push(<CountdownPart value={h} label="hour" />);
    if (d || h || m) parts.push(<CountdownPart value={m} label="min" />);
    if (!expired) parts.push(<CountdownPart value={s} label="sec" />);

    return (
        <h3 className={`flex gap-2 items-center ${className}`}>
            {expired ? <span>{expiredText}</span> : parts}
        </h3>
    );
}
