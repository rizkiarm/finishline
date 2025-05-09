import { useState, useEffect, useMemo } from "preact/hooks";
import CountdownDisplay from "./CountdownDisplay";
import { Hourglass } from "lucide-react";

export default function SessionDeadlineAlert({ deadline }: { deadline: string }) {
    // Parse deadline once
    const deadlineTime = useMemo(() => new Date(deadline).getTime(), [deadline]);

    // Handle invalid deadline value
    const isValid = !isNaN(deadlineTime);

    const getSecsLeft = () =>
        isValid ? Math.floor((deadlineTime - Date.now()) / 1000) : 0;

    const [secsLeft, setSecsLeft] = useState(getSecsLeft);

    useEffect(() => {
        if (!isValid) return;

        const interval = setInterval(() => {
            setSecsLeft(getSecsLeft());
        }, 1000);

        return () => clearInterval(interval);
    }, [deadlineTime, isValid, secsLeft]);

    return (
        <div
            role="alert"
            className="alert alert-vertical sm:alert-horizontal"
            aria-live="polite"
        >
            <div className="text-error">
                <Hourglass size={24} className="mr-2" aria-hidden="true" />
            </div>
            <div>
                {isValid ? (
                    <>
                        <CountdownDisplay
                            secsLeft={secsLeft}
                            expiredText="Past deadline"
                        />
                        <div className="text-xs">
                            {new Date(deadlineTime).toLocaleString()}
                        </div>
                    </>
                ) : (
                    <span className="text-xs text-error">Invalid deadline</span>
                )}
            </div>
            <div className="badge badge-outline badge-error">Deadline</div>
        </div>
    );
}
