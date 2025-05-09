import type { Color } from "../types";

interface ProgressBarProps {
    progress?: number;
    label?: string;
    color?: Color;
    height?: string;
    text?: string;
}

// DaisyUI color to class mapping for progress bar
const PROGRESS_COLOR_CLASSES: Record<Color, string> = {
    neutral: "progress-neutral",
    primary: "progress-primary",
    secondary: "progress-secondary",
    accent: "progress-accent",
    info: "progress-info",
    success: "progress-success",
    warning: "progress-warning",
    error: "progress-error",
};

export default function ProgressBar({
    progress = 0,
    label,
    color = "success",
    height = "h-6",
    text,
}: ProgressBarProps) {
    // Clamp progress in [0, 100]
    const safeProgress = Math.max(0, Math.min(100, progress));
    const colorClass = PROGRESS_COLOR_CLASSES[color] ?? PROGRESS_COLOR_CLASSES.success;
    const labelId = label ? "progressbar-label" : undefined;

    return (
        <div className="w-full flex flex-col gap-1">
            <div className={`relative w-full ${height}`}>
                <progress
                    className={`progress w-full
                        [&::-webkit-progress-value]:transition-all [&::-webkit-progress-value]:duration-500
                        [&::-moz-progress-bar]:transition-all [&::-moz-progress-bar]:duration-500
                        ${colorClass} ${height}`}
                    value={safeProgress}
                    max={100}
                    aria-label={label}
                    aria-valuenow={safeProgress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    {...(labelId ? { "aria-labelledby": labelId } : {})}
                />
                <span className="absolute inset-0 flex justify-center items-center text-xs font-semibold text-base-content/80 pointer-events-none">
                    {text != null ? text : Math.round(safeProgress) + "%"}
                </span>
            </div>
        </div>
    );
}
