import { Sun, Moon, ListTodo, Plus, List } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { APP_NAME } from "../constants";

interface NavbarProps {
    onStartNew: () => void;
    onShowList: () => void;
}

export default function Navbar({ onStartNew, onShowList }: NavbarProps) {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="navbar bg-base-100 shadow-sm mb-0">
            <div className="container max-w-7xl mx-auto flex-1 flex items-center px-2 sm:px-6">
                <a
                    className="font-bold text-lg flex items-center gap-2"
                    href="#"
                    tabIndex={-1}
                    aria-current="page"
                >
                    <ListTodo size={24} aria-hidden="true" />
                    <span className="hidden sm:inline">{APP_NAME}</span>
                </a>
                <div className="flex-1"></div>
                <button
                    type="button"
                    className="btn btn-ghost btn-circle"
                    title="New session"
                    aria-label="Start a new session"
                    onClick={onStartNew}
                >
                    <Plus size={20} aria-hidden="true" />
                </button>
                <button
                    type="button"
                    className="btn btn-ghost btn-circle"
                    title="List sessions"
                    aria-label="Show session list"
                    onClick={onShowList}
                >
                    <List size={20} aria-hidden="true" />
                </button>
                <button
                    type="button"
                    className="btn btn-ghost btn-circle"
                    title="Toggle dark/light"
                    aria-label={
                        theme === "dark"
                            ? "Switch to light mode"
                            : "Switch to dark mode"
                    }
                    onClick={toggleTheme}
                >
                    {theme === "dark" ? (
                        <Sun size={20} aria-hidden="true" />
                    ) : (
                        <Moon size={20} aria-hidden="true" />
                    )}
                </button>
            </div>
        </div>
    );
}
