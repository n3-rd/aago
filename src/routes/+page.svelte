<script lang="ts">
    import { onDestroy } from 'svelte';
    import { timerSettings } from '$lib/stores/timerStore';
    import { sessionHistory } from '$lib/stores/historyStore';
    import TimerDisplay from '$lib/components/TimerDisplay.svelte';
    import TimerControls from '$lib/components/TimerControls.svelte';
    import TimerSettings from '$lib/components/TimerSettings.svelte';
    import SessionName from '$lib/components/SessionName.svelte';
    import HistoryDisplay from '$lib/components/HistoryDisplay.svelte';
    import type { TimerSettings as TimerSettingsType, TimerState, TimerStatus, SessionHistory } from '$lib/types';

    let timeLeft = $state(0);
    let status = $state<TimerStatus>('stopped');
    let timerState = $state<TimerState>('work');
    let completedSessions = $state(0);
    let showSettings = $state(false);
    let sessionName = $state('');
    let sessionStartTime = $state<string | null>(null);
    
    let timer: number;

    let minutes = $derived(Math.floor(timeLeft / 60));
    let seconds = $derived(timeLeft % 60);

    function getDuration() {
        switch (timerState) {
            case 'work':
                return $timerSettings.workDuration * 60;
            case 'break':
                return $timerSettings.breakDuration * 60;
            case 'longBreak':
                return $timerSettings.longBreakDuration * 60;
        }
    }

    function startTimer() {
        if (status === 'stopped') {
            timeLeft = getDuration();
            sessionStartTime = new Date().toISOString();
        }
        status = 'running';
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
            } else {
                handleTimerComplete();
            }
        }, 1000);
    }

    function pauseTimer() {
        status = 'paused';
        clearInterval(timer);
    }

    function resetTimer() {
        if (status !== 'stopped' && sessionStartTime) {
            recordSession(false);
        }
        status = 'stopped';
        clearInterval(timer);
        timeLeft = getDuration();
        sessionStartTime = null;
    }

    function recordSession(completed: boolean) {
        const session: SessionHistory = {
            id: crypto.randomUUID(),
            name: sessionName,
            type: timerState,
            duration: getDuration() - timeLeft,
            startTime: sessionStartTime!,
            endTime: new Date().toISOString(),
            completed
        };
        sessionHistory.addSession(session);
    }

    function handleTimerComplete() {
        recordSession(true);
        
        if (timerState === 'work') {
            completedSessions++;
            if (completedSessions % $timerSettings.sessionsBeforeLongBreak === 0) {
                timerState = 'longBreak';
            } else {
                timerState = 'break';
            }
        } else {
            timerState = 'work';
        }
        
        sessionStartTime = new Date().toISOString();
        timeLeft = getDuration();
    }

    function updateSettings(newSettings: TimerSettingsType) {
        $timerSettings = newSettings;
        showSettings = false;
        if (status !== 'running') {
            resetTimer();
        }
    }

    onDestroy(() => {
        if (status !== 'stopped' && sessionStartTime) {
            recordSession(false);
        }
        clearInterval(timer);
    });
</script>

<main class="container mx-auto px-4 py-8 max-w-2xl">
    <h1 class="text-3xl font-bold text-center mb-8">Pomodoro Timer</h1>
    
    <SessionName
        currentName={sessionName}
        onNameChange={(name) => sessionName = name}
    />
    
    <div class="text-center mb-4">
        <span class="text-lg font-semibold">
            {timerState === 'work' ? 'Work Time' : timerState === 'break' ? 'Break Time' : 'Long Break'}
        </span>
        <span class="text-sm ml-2">
            (Session {Math.floor(completedSessions / $timerSettings.sessionsBeforeLongBreak) + 1})
        </span>
    </div>

    <div class="relative h-80 w-80 mx-auto text-black rounded-full flex justify-center items-center">
        <TimerDisplay 
            minutes={minutes} 
            seconds={seconds} 
            initialDuration={getDuration()}
        />
    </div>
    
    <TimerControls
        status={status}
        onStart={startTimer}
        onPause={pauseTimer}
        onReset={resetTimer}
    />

    <div class="text-center mt-8">
        <button
            onclick={() => showSettings = !showSettings}
            class="text-blue-500 hover:text-blue-600 underline"
        >
            {showSettings ? 'Hide Settings' : 'Show Settings'}
        </button>
    </div>

    {#if showSettings}
        <TimerSettings onSave={updateSettings} />
    {/if}

    <HistoryDisplay />
</main>
