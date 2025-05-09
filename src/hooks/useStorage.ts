import { useState, useEffect } from "preact/hooks";
import { defaultStorage } from "../utils/storage";

// Generic hook for any storage backend
export function useStorage<T>(key: string, initialValue: T) {
    const [value, setValue] = useState<T>(
        () => defaultStorage.getItem<T>(key, initialValue) ?? initialValue,
    );

    useEffect(() => {
        defaultStorage.setItem<T>(key, value);
        // Only re-run if key or value changes
    }, [key, value]);

    const remove = () => {
        defaultStorage.remove(key);
        setValue(initialValue);
    };

    return [value, setValue, remove] as const;
}
