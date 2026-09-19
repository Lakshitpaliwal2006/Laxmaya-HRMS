import React, { useState } from "react";
import { CalendarClock, Video, Users, MapPin, ChevronRight, Bell } from "lucide-react";

/**
 * MeetingsEventsBox
 * Drop-in card matching the app's existing design system
 * (rounded-3xl, slate borders, dark: variants). Shows today's
 * meetings and upcoming events from raw mock data below —
 * swap MOCK_ITEMS for your real data source.
 */

const MOCK_ITEMS = [
    {
        id: 1,
        title: "Sprint Planning",
        type: "meeting",
        mode: "video",
        time: "10:00 AM",
        duration: "45 min",
        attendees: ["AR", "VS", "MI", "PN"],
        department: "Engineering",
    },
    {
        id: 2,
        title: "Q3 Budget Review",
        type: "meeting",
        mode: "in-person",
        time: "12:30 PM",
        duration: "1 hr",
        attendees: ["RK", "KM"],
        department: "Finance",
        location: "Conference Room B",
    },
    {
        id: 3,
        title: "Company Town Hall",
        type: "event",
        mode: "video",
        time: "4:00 PM",
        duration: "1 hr",
        attendees: ["ALL"],
        department: "Company-wide",
    },
    {
        id: 4,
        title: "New Hire Onboarding",
        type: "event",
        mode: "in-person",
        time: "9:30 AM",
        duration: "2 hr",
        attendees: ["HR", "FA", "NJ"],
        department: "HR",
        location: "Training Room 1",
    },
    {
        id: 5,
        title: "1:1 with Manager",
        type: "meeting",
        mode: "video",
        time: "3:00 PM",
        duration: "30 min",
        attendees: ["IB", "AV"],
        department: "Sales",
    },
];

const TYPE_STYLES = {
    meeting: {
        label: "Meeting",
        chip: "bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-500/10 dark:text-brand-400 dark:border-brand-500/20",
    },
    event: {
        label: "Event",
        chip: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 dark:bg-fuchsia-500/10 dark:text-fuchsia-400 dark:border-fuchsia-500/20",
    },
};

export default function Meetings() {
    const [filter, setFilter] = useState("all");

    const items = MOCK_ITEMS.filter((i) => filter === "all" || i.type === filter);
    const meetingCount = MOCK_ITEMS.filter((i) => i.type === "meeting").length;
    const eventCount = MOCK_ITEMS.filter((i) => i.type === "event").length;

    return (
        <div className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm dark:shadow-card transition-colors">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CalendarClock className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                    Meetings &amp; Events Today
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                    {meetingCount} meetings · {eventCount} events
                </span>
            </div>

            <div className="flex gap-1.5">
                {["all", "meeting", "event"].map((key) => (
                    <button
                        key={key}
                        onClick={() => setFilter(key)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${filter === key
                                ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white"
                                : "bg-transparent text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                    >
                        {key === "all" ? "All" : TYPE_STYLES[key].label + "s"}
                    </button>
                ))}
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto -mx-1 px-1">
                {items.length === 0 && (
                    <div className="text-center text-xs text-slate-400 py-8">Nothing scheduled here.</div>
                )}
                {items.map((item) => {
                    const t = TYPE_STYLES[item.type];
                    return (
                        <div
                            key={item.id}
                            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-start gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                        >
                            <div className="flex flex-col items-center justify-center w-14 shrink-0 pt-0.5">
                                <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">{item.time}</span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-500">{item.duration}</span>
                            </div>

                            <div className="flex-1 min-w-0 space-y-1.5">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">{item.title}</span>
                                    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border shrink-0 ${t.chip}`}>
                                        {t.label}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                                    <span className="flex items-center gap-1">
                                        {item.mode === "video" ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                                        {item.mode === "video" ? "Video call" : item.location || "In-person"}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Users className="w-3 h-3" />
                                        {item.department}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1.5 pt-0.5">
                                    <div className="flex -space-x-1.5">
                                        {item.attendees.slice(0, 4).map((a, idx) => (
                                            <div
                                                key={idx}
                                                className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-400 text-[9px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-950 shrink-0"
                                            >
                                                {a}
                                            </div>
                                        ))}
                                    </div>
                                    {item.attendees.length > 4 && (
                                        <span className="text-[10px] text-slate-400">+{item.attendees.length - 4}</span>
                                    )}
                                </div>
                            </div>

                            <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-700 shrink-0 mt-1" />
                        </div>
                    );
                })}
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <Bell className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
                <span>You'll get a reminder 10 minutes before each item starts.</span>
            </div>
        </div>
    );
}