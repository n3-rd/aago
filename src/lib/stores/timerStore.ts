import { writable } from 'svelte/store';
import type { TimerSettings } from '$lib/types';

export const timerSettings = writable<TimerSettings>({
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4
}); 