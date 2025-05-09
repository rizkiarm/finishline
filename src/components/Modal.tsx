import { useEffect } from "preact/hooks";
import type { ComponentChildren } from "preact";
import { X } from "lucide-react";

// Type-safe modal sizes
const MODAL_SIZE_CLASSES = {
    xs: "max-w-xs",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    "7xl": "max-w-7xl",
    full: "max-w-full",
} as const;

type ModalSize = keyof typeof MODAL_SIZE_CLASSES;

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: ComponentChildren;
    size?: ModalSize;
}

export default function Modal({
    open,
    onClose,
    title,
    children,
    size = "md",
}: ModalProps) {
    // Prevent background scroll when modal is open
    useEffect(() => {
        document.body.classList.toggle("overflow-hidden", open);
        // Clean up
        return () => document.body.classList.remove("overflow-hidden");
    }, [open]);

    // Handle Escape key to close
    useEffect(() => {
        if (!open) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [open, onClose]);

    if (!open) return null;

    function handleBackdrop(e: MouseEvent) {
        if ((e.target as HTMLElement).classList.contains("modal")) onClose();
    }

    const sizeClass = MODAL_SIZE_CLASSES[size];
    const titleId = title ? "modal-title" : undefined;

    return (
        <div
            className="modal modal-open z-40"
            onClick={handleBackdrop}
            aria-modal="true"
            role="dialog"
            {...(titleId ? { "aria-labelledby": titleId } : {})}
        >
            <div className={`modal-box bg-base-200 w-full ${sizeClass}`}>
                <div className="flex items-center mb-2">
                    {title && (
                        <span id={titleId} className="font-bold text-lg flex-1">
                            {title}
                        </span>
                    )}
                    <button
                        className="btn btn-sm btn-circle btn-ghost"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <X size={20} aria-hidden="true" />
                    </button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
}
