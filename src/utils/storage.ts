/* eslint-disable no-unused-vars */
export interface StorageBackend {
    getItem<T>(key: string, fallback?: T): T | undefined;
    setItem<T>(key: string, value: T): void;
    remove(key: string): void;
}

class LocalStorageBackend implements StorageBackend {
    getItem<T>(key: string, fallback?: T): T | undefined {
        if (typeof window === "undefined") return fallback;
        try {
            const value = localStorage.getItem(key);
            if (value === null) return fallback;
            return JSON.parse(value) as T;
        } catch {
            return fallback;
        }
    }

    setItem<T>(key: string, value: T): void {
        if (typeof window === "undefined") return;
        localStorage.setItem(key, JSON.stringify(value));
    }

    remove(key: string): void {
        if (typeof window === "undefined") return;
        localStorage.removeItem(key);
    }
}

export const defaultStorage: StorageBackend = new LocalStorageBackend();
