import type { ComponentChildren, JSX } from "preact";
import { Info } from "lucide-react";
import classNames from "classnames";
import type { Color } from "../types";

interface AlertProps {
    /** Optional icon component to render on the left */
    icon?: ComponentChildren;
    /** Color style for the alert (must be a DaisyUI-compatible Color) */
    color?: Color;
    /** Additional classes for customization */
    className?: string;
    /** Alert content */
    children: ComponentChildren;
}

/** DaisyUI v5 alert color to class mapping */
const ALERT_COLOR_CLASSES: Record<Color, string> = {
    neutral: "alert-neutral",
    primary: "alert-primary",
    secondary: "alert-secondary",
    accent: "alert-accent",
    info: "alert-info",
    success: "alert-success",
    warning: "alert-warning",
    error: "alert-error",
};

/**
 * Alert: a stylized notification component.
 */
export default function Alert({
    icon = <Info size={20} className="mr-2" aria-hidden="true" />,
    color = "info",
    className,
    children,
}: AlertProps): JSX.Element {
    const colorClass = ALERT_COLOR_CLASSES[color] ?? ALERT_COLOR_CLASSES["info"];

    return (
        <div
            role="alert"
            className={classNames(
                "alert",
                colorClass,
                "flex items-center justify-center text-center my-3 text-base",
                className,
            )}
        >
            {icon}
            <span>{children}</span>
        </div>
    );
}
