import { writable } from 'svelte/store';
import type { SessionHistory } from '$lib/types';

const HISTORY_KEY = 'pomodoro_history';

function createHistoryStore() {
    const { subscribe, set, update } = writable<SessionHistory[]>([]);

    // Only initialize from localStorage in the browser
    if (typeof window !== 'undefined') {
        const storedHistory = localStorage.getItem(HISTORY_KEY);
        if (storedHistory) {
            set(JSON.parse(storedHistory));
        }
    }

    return {
        subscribe,
        addSession: (session: SessionHistory) => {
            if (typeof window === 'undefined') return;
            
            update(history => {
                const newHistory = [session, ...history];
                localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
                return newHistory;
            });
        },
        clearHistory: () => {
            if (typeof window === 'undefined') return;
            
            localStorage.removeItem(HISTORY_KEY);
            set([]);
        }
    };
}

export const sessionHistory = createHistoryStore(); 