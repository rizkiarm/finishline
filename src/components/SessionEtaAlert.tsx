import { useEffect, useState } from "preact/hooks";
import CountdownDisplay from "./CountdownDisplay";
import { CalendarClock } from "lucide-react";

interface Props {
    eta: number; // seconds remaining until estimated completion
    running: boolean;
    done: number;
    total: number;
}

export default function SessionEtaAlert({ eta, running, done, total }: Props) {
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, [running, done, total]);

    if (eta <= 0 || done >= total) return null;

    const etaDate = new Date(now + eta * 1000);

    return (
        <div role="alert" className="alert alert-vertical sm:alert-horizontal">
            <div className="text-info">
                <CalendarClock size={24} className="mr-2" />
            </div>
            <div>
                <CountdownDisplay secsLeft={eta} expiredText="Completed" />
                <div className="text-xs">{etaDate.toLocaleString()}</div>
            </div>
            <div className="badge badge-outline badge-info">Estimated Completion</div>
        </div>
    );
}
