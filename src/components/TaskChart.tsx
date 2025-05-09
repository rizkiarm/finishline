import { useEffect, useRef, useState } from "preact/hooks";
import Chart from "chart.js/auto";
import { useTheme } from "../context/ThemeContext";
import { formatTime } from "../utils/format";
import type { Task } from "../types";
import type { Aggregation, ValueType } from "../types";

interface TaskChartProps {
    tasks: Task[];
}

// Utility functions
function pad(n: number, len = 2): string {
    return String(n).padStart(len, "0");
}
function getHourlyKey(dt: Date | string | number): string {
    const d = new Date(dt);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}`;
}
function getDailyKey(dt: Date | string | number): string {
    const d = new Date(dt);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function getWeeklyKey(dt: Date | string | number): string {
    const d = new Date(dt);
    const day = d.getDay();
    const monday = new Date(d);
    monday.setDate(d.getDate() - ((day + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    return `W${monday.getFullYear()}-${pad(monday.getMonth() + 1)}-${pad(monday.getDate())}`;
}
function getHourlyLabel(key: string): string {
    const [datePart, hourPart] = key.split("T");
    const [y, m, d] = datePart.split("-").map(Number);
    const h = Number(hourPart);
    const dt = new Date(y, m - 1, d, h);
    let hour = dt.getHours();
    const ampm =
        hour === 0
            ? "12am"
            : hour < 12
              ? `${hour}am`
              : hour === 12
                ? "12pm"
                : `${hour - 12}pm`;
    return `${dt.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })}, ${ampm}`;
}
function getDailyLabel(key: string): string {
    const [y, m, d] = key.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}
function getWeeklyLabel(key: string): string {
    const [, y, m, d] = key.match(/^W(\d+)-(\d+)-(\d+)$/)!.map(Number);
    const dt = new Date(y, m - 1, d);
    return `Week of ${dt.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })}`;
}
function getLabelFromKey(key: string, agg: string) {
    if (agg === "hourly") return getHourlyLabel(key);
    if (agg === "daily") return getDailyLabel(key);
    if (agg === "weekly") return getWeeklyLabel(key);
    return key;
}
function generateRangeKeys(minDt: Date, maxDt: Date, agg: string) {
    const keys = [];
    const cur = new Date(minDt);
    if (agg === "hourly") {
        cur.setMinutes(0, 0, 0);
        while (cur <= maxDt) {
            keys.push(getHourlyKey(cur));
            cur.setHours(cur.getHours() + 1);
        }
    } else if (agg === "daily") {
        cur.setHours(0, 0, 0, 0);
        while (cur <= maxDt) {
            keys.push(getDailyKey(cur));
            cur.setDate(cur.getDate() + 1);
        }
    } else if (agg === "weekly") {
        const day = cur.getDay();
        cur.setDate(cur.getDate() - ((day + 6) % 7));
        cur.setHours(0, 0, 0, 0);
        while (cur <= maxDt) {
            keys.push(getWeeklyKey(cur));
            cur.setDate(cur.getDate() + 7);
        }
    }
    return keys;
}
function getThemeColors(theme: string) {
    const root = getComputedStyle(document.documentElement);
    const isDark = theme === "dark";
    return {
        text: root.getPropertyValue("--bc").trim() || (isDark ? "#d4d4d8" : "#27272a"),
        grid: root.getPropertyValue("--b2").trim() || (isDark ? "#404040" : "#d1d5db"),
        bar: root.getPropertyValue("--su").trim() || (isDark ? "#54cf96" : "#54cf96"),
        accent: root.getPropertyValue("--a").trim() || (isDark ? "#fbbf24" : "#f59e42"),
        line: root.getPropertyValue("--in").trim() || (isDark ? "#f06d81" : "#f06d81"),
        tooltipBg:
            root.getPropertyValue("--b1").trim() || (isDark ? "#18181b" : "#fff"),
    };
}

export default function TaskChart({ tasks }: TaskChartProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme } = useTheme();
    const [view, setView] = useState<"per-task" | "aggregate">("per-task");
    const [aggregation, setAggregation] = useState<Aggregation>("hourly");
    const [valueType, setValueType] = useState<ValueType>("count");

    useEffect(() => {
        if (!Chart || !canvasRef.current) return;
        const colors = getThemeColors(theme);

        let processedData: { labels: string[]; data: number[] } = {
            labels: [],
            data: [],
        };
        let avgLineArray: number[] = [];
        let aggregateAvg = 0;

        if (view === "aggregate") {
            if (!tasks.length) {
                processedData = { labels: [], data: [] };
                avgLineArray = [];
            } else {
                const sorted = [...tasks].sort(
                    (a, b) =>
                        new Date(a.datetime).getTime() - new Date(b.datetime).getTime(),
                );
                const minDt = new Date(sorted[0].datetime);
                const maxDt = new Date(sorted[sorted.length - 1].datetime);

                const buckets: Record<string, Task[]> = {};
                for (const t of tasks) {
                    let key;
                    if (aggregation === "hourly") key = getHourlyKey(t.datetime);
                    else if (aggregation === "daily") key = getDailyKey(t.datetime);
                    else key = getWeeklyKey(t.datetime);
                    if (!buckets[key]) buckets[key] = [];
                    buckets[key].push(t);
                }
                const keys = generateRangeKeys(minDt, maxDt, aggregation);

                let data: number[] = [];
                if (valueType === "count") {
                    data = keys.map((k) => (buckets[k] ? buckets[k].length : 0));
                } else if (valueType === "totalDuration") {
                    data = keys.map((k) =>
                        buckets[k]
                            ? buckets[k].reduce((sum, t) => sum + (t.time || 0), 0)
                            : 0,
                    );
                } else if (valueType === "averageDuration") {
                    data = keys.map((k) =>
                        buckets[k] && buckets[k].length
                            ? buckets[k].reduce((sum, t) => sum + (t.time || 0), 0) /
                              buckets[k].length
                            : 0,
                    );
                }

                aggregateAvg = data.length
                    ? data.reduce((a, b) => a + b, 0) / data.length
                    : 0;
                avgLineArray = Array(data.length).fill(aggregateAvg);

                processedData = {
                    labels: keys.map((k) => getLabelFromKey(k, aggregation)),
                    data,
                };
            }
        } else {
            const avgTaskTime = tasks.length
                ? tasks.reduce((a, b) => a + (b.time || 0), 0) / tasks.length
                : 0;
            avgLineArray = Array(tasks.length).fill(avgTaskTime);
            processedData = {
                labels: tasks.map((_, i) => `Task ${i + 1}`),
                data: tasks.map((t) => (typeof t.time === "number" ? t.time : 0)),
            };
        }

        if ((canvasRef.current as any)._chartRef) {
            (canvasRef.current as any)._chartRef.destroy();
            (canvasRef.current as any)._chartRef = null;
        }

        const ctx = canvasRef.current.getContext("2d")!;
        canvasRef.current.width = Math.max(
            600,
            (processedData.labels.length || 1) * 40,
        );

        const getYAxisLabel = () => {
            if (view === "aggregate") {
                if (valueType === "count") return "Task Count";
                if (valueType === "totalDuration") return "Total Duration";
                if (valueType === "averageDuration") return "Average Duration";
            }
            return "Task Time";
        };

        const chart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: processedData.labels,
                datasets: [
                    {
                        label:
                            view === "per-task"
                                ? "Average Task Time"
                                : `Average: ${
                                      valueType === "count"
                                          ? aggregateAvg.toFixed(2)
                                          : formatTime(aggregateAvg)
                                  }`,
                        data: avgLineArray,
                        type: "line" as const,
                        fill: false,
                        borderColor: colors.line,
                        borderWidth: 4,
                        pointRadius: 0,
                        order: 1,
                        hidden: !avgLineArray.length,
                    },
                    {
                        label:
                            view === "aggregate"
                                ? valueType === "count"
                                    ? `${aggregation.charAt(0).toUpperCase() + aggregation.slice(1)} Task Count`
                                    : valueType === "totalDuration"
                                      ? `${aggregation.charAt(0).toUpperCase() + aggregation.slice(1)} Total Duration`
                                      : `${aggregation.charAt(0).toUpperCase() + aggregation.slice(1)} Avg Duration`
                                : "Task Time",
                        data: processedData.data,
                        backgroundColor: colors.bar,
                        borderRadius: 6,
                        borderWidth: 0,
                        order: 2,
                    },
                ],
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: colors.text,
                            font: {
                                family: "inherit",
                                size: 13,
                                weight: 600,
                            },
                            boxWidth: 14,
                        },
                    },
                    tooltip: {
                        backgroundColor: colors.tooltipBg,
                        titleColor: colors.text,
                        bodyColor: colors.text,
                        borderColor: colors.grid,
                        borderWidth: 1,
                        callbacks: {
                            label: (ctx2: any) => {
                                if (view === "per-task") {
                                    const task = tasks[ctx2.dataIndex];
                                    const dt = task ? new Date(task.datetime) : null;
                                    const dtStr = dt ? dt.toLocaleString() : "";
                                    return [
                                        `Task Time: ${formatTime(ctx2.parsed.y)}`,
                                        `Time: ${dtStr}`,
                                    ];
                                } else if (
                                    typeof ctx2.dataset.label === "string" &&
                                    ctx2.dataset.label.startsWith("Average")
                                ) {
                                    if (valueType === "count") {
                                        return `Average: ${aggregateAvg.toFixed(2)}`;
                                    } else {
                                        return `Average: ${formatTime(aggregateAvg)}`;
                                    }
                                } else {
                                    if (valueType === "count") {
                                        return `Task Count: ${ctx2.parsed.y}`;
                                    } else if (valueType === "totalDuration") {
                                        return `Total Duration: ${formatTime(ctx2.parsed.y)}`;
                                    } else {
                                        return `Avg Duration: ${formatTime(ctx2.parsed.y)}`;
                                    }
                                }
                            },
                        },
                    },
                },
                scales: {
                    x: {
                        ticks: {
                            color: colors.text,
                            font: {
                                family: "inherit",
                                size: 13,
                                weight: 500,
                            },
                            autoSkip: true,
                            maxRotation: 45,
                        },
                        grid: { color: colors.grid },
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: getYAxisLabel(),
                            color: colors.text,
                            font: {
                                family: "inherit",
                                size: 13,
                                weight: 600,
                            },
                        },
                        ticks: {
                            color: colors.text,
                            font: {
                                family: "inherit",
                                size: 13,
                                weight: 500,
                            },
                            callback:
                                view === "per-task" || valueType !== "count"
                                    ? (val: string | number) => {
                                          if (typeof val === "number")
                                              return formatTime(val);
                                          return val;
                                      }
                                    : undefined,
                        },
                        grid: { color: colors.grid },
                    },
                },
                backgroundColor: "transparent",
            },
        });
        (canvasRef.current as any)._chartRef = chart;
        canvasRef.current.style.backgroundColor = "transparent";
        return () => {
            if (canvasRef.current && (canvasRef.current as any)._chartRef) {
                (canvasRef.current as any)._chartRef.destroy();
                (canvasRef.current as any)._chartRef = null;
            }
        };
    }, [tasks, theme, view, aggregation, valueType]);

    if (!tasks.length) {
        return <div className="text-center">No tasks to display.</div>;
    }

    return (
        <div className="w-full max-w-full">
            <div className="tabs tabs-box flex flex-wrap mb-2 gap-2">
                <a
                    className={`tab tab-bordered font-medium ${view === "per-task" ? "tab-active" : ""}`}
                    onClick={() => setView("per-task")}
                >
                    History
                </a>
                <a
                    className={`tab tab-bordered font-medium ${view === "aggregate" ? "tab-active" : ""}`}
                    onClick={() => setView("aggregate")}
                >
                    Aggregate
                </a>
            </div>
            {view === "aggregate" && (
                <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-3 my-3">
                    <div className="join">
                        <button
                            type="button"
                            className={`btn btn-sm ${aggregation === "hourly" ? "btn-active" : "btn-outline"}`}
                            onClick={() => setAggregation("hourly")}
                        >
                            Hourly
                        </button>
                        <button
                            type="button"
                            className={`btn btn-sm ${aggregation === "daily" ? "btn-active" : "btn-outline"}`}
                            onClick={() => setAggregation("daily")}
                        >
                            Daily
                        </button>
                        <button
                            type="button"
                            className={`btn btn-sm ${aggregation === "weekly" ? "btn-active" : "btn-outline"}`}
                            onClick={() => setAggregation("weekly")}
                        >
                            Weekly
                        </button>
                    </div>
                    <div className="join">
                        <button
                            type="button"
                            className={`btn btn-sm font-semibold px-4 ${valueType === "count" ? "btn-active" : "btn-outline"}`}
                            onClick={() => setValueType("count")}
                        >
                            Count
                        </button>
                        <button
                            type="button"
                            className={`btn btn-sm font-semibold px-4 ${valueType === "totalDuration" ? "btn-active" : "btn-outline"}`}
                            onClick={() => setValueType("totalDuration")}
                        >
                            Total
                        </button>
                        <button
                            type="button"
                            className={`btn btn-sm font-semibold px-4 ${valueType === "averageDuration" ? "btn-active" : "btn-outline"}`}
                            onClick={() => setValueType("averageDuration")}
                        >
                            Average
                        </button>
                    </div>
                </div>
            )}
            <div className="chart-container mb-1 bg-base-100 rounded-lg p-2">
                <canvas ref={canvasRef} height={350}></canvas>
            </div>
        </div>
    );
}
