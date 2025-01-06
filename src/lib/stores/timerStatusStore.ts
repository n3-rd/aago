import { writable } from 'svelte/store';
import type { TimerStatus } from '$lib/types';

export const timerStatusStore = writable<TimerStatus>('stopped'); 