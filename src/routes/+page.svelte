<script lang="ts">
    import { onDestroy } from 'svelte';
    import { timerSettings } from '$lib/stores/timerStore';
    import TimerDisplay from '$lib/components/TimerDisplay.svelte';
    import TimerControls from '$lib/components/TimerControls.svelte';
    import TimerSettings from '$lib/components/TimerSettings.svelte';
    import type { TimerSettings as TimerSettingsType, TimerState, TimerStatus } from '$lib/types';

    let timeLeft = $state(0);
    let status = $state<TimerStatus>('stopped');
    let timerState = $state<TimerState>('work');
    let completedSessions = $state(0);
    let showSettings = $state(false);
    
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
        status = 'stopped';
        clearInterval(timer);
        timeLeft = getDuration();
    }

    function handleTimerComplete() {
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
        resetTimer();
    }

    function updateSettings(newSettings: TimerSettingsType) {
        $timerSettings = newSettings;
        showSettings = false;
        if (status !== 'running') {
            resetTimer();
        }
    }

    onDestroy(() => {
        clearInterval(timer);
    });
</script>

<main class="container mx-auto px-4 py-8 max-w-2xl">
    <h1 class="text-3xl font-bold text-center mb-8">Pomodoro Timer</h1>
    
    <div class="text-center mb-4">
        <span class="text-lg font-semibold">
            {timerState === 'work' ? 'Work Time' : timerState === 'break' ? 'Break Time' : 'Long Break'}
        </span>
        <span class="text-sm ml-2">
            (Session {Math.floor(completedSessions / $timerSettings.sessionsBeforeLongBreak) + 1})
        </span>
    </div>

    <TimerDisplay minutes={minutes} seconds={seconds} />
    
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
</main>
