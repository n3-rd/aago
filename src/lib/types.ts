export type TimerSettings = {
    workDuration: number;
    breakDuration: number;
    longBreakDuration: number;
    sessionsBeforeLongBreak: number;
};

export type TimerState = 'work' | 'break' | 'longBreak';
export type TimerStatus = 'running' | 'paused' | 'stopped'; 