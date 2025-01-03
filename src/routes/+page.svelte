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
    import * as Dialog from "$lib/components/ui/dialog";
    import { Button } from "$lib/components/ui/button";
	import { Pencil, RefreshCcw, Coffee, Brain, Battery } from 'lucide-svelte';

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

<main class="container mx-auto px-4 py-8 max-w-xl">
    <h1 class="text-2xl font-light text-center mb-12 tracking-wide">Pomodoro Timer</h1>
    
    <div class="text-center mb-8 flex justify-center items-center">
        <div class="flex items-center gap-2">
            {#if timerState === 'work'}
                <div class="transition-all duration-700 ease-in-out animate-in fade-in-50 flex items-center gap-2">
                    <Brain class="w-4 h-4 text-blue-600" />
                    <span class="text-base font-light text-blue-600">Work Time</span>
                </div>
            {:else if timerState === 'break'}
                <div class="transition-all duration-700 ease-in-out animate-in fade-in-50 flex items-center gap-2">
                    <Coffee class="w-4 h-4 text-green-600" />
                    <span class="text-base font-light text-green-600">Break Time</span>
                </div>
            {:else}
                <div class="transition-all duration-700 ease-in-out animate-in fade-in-50 flex items-center gap-2">
                    <Battery class="w-4 h-4 text-purple-600" />
                    <span class="text-base font-light text-purple-600">Long Break</span>
                </div>
            {/if}
        </div>
        <span class="text-xs ml-2 text-gray-500 font-light">
            ({sessionName || `Session ${Math.floor(completedSessions / $timerSettings.sessionsBeforeLongBreak) + 1}`})
        </span>

        <Dialog.Root>
            <Dialog.Trigger>
                <Button 
                    variant="ghost" 
                    class="ml-3 h-6 w-6 bg-transparent rounded-full text-gray-400 hover:text-gray-600 p-0.5 hover:scale-110 transition-all duration-300"
                > 
                    <Pencil class="w-4 h-4" />
                </Button>
            </Dialog.Trigger>
            <Dialog.Content class="sm:max-w-[425px]">
                <Dialog.Header>
                    <Dialog.Title>Edit Session Name</Dialog.Title>
                    <Dialog.Description>
                        Give your session a meaningful name.
                    </Dialog.Description>
                </Dialog.Header>
                <div class="py-4">
                    <SessionName
                        currentName={sessionName}
                        onNameChange={(name) => {
                            sessionName = name;
                        }}
                    />
                </div>
            </Dialog.Content>
        </Dialog.Root>
    </div>

    <div class="relative h-72 w-72 mx-auto text-gray-800 rounded-full flex justify-center items-center transition-opacity duration-500 {status === 'running' ? 'opacity-90' : 'opacity-100'}">
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

    <div class="flex justify-center gap-3 mt-8">
        <Dialog.Root>
            <Dialog.Trigger disabled={status === 'running'}>
                <Button 
                    variant="ghost" 
                    disabled={status === 'running'} 
                    title={status === 'running' ? 'Stop the timer to change settings' : 'Settings'}
                    class="text-gray-500 hover:text-gray-700 transition-all duration-300 hover:scale-105 {status === 'running' ? 'opacity-50' : ''}"
                >
                    Settings
                </Button>
            </Dialog.Trigger>
            <Dialog.Content class="sm:max-w-[425px]">
                <Dialog.Header>
                    <Dialog.Title>Timer Settings</Dialog.Title>
                    <Dialog.Description>
                        Adjust your timer durations and preferences.
                    </Dialog.Description>
                </Dialog.Header>
                <TimerSettings onSave={updateSettings} />
            </Dialog.Content>
        </Dialog.Root>

        <Dialog.Root>
            <Dialog.Trigger>
                <Button 
                    variant="ghost"
                    class="text-gray-500 hover:text-gray-700 transition-all duration-300 hover:scale-105"
                >
                    History
                </Button>
            </Dialog.Trigger>
            <Dialog.Content class="sm:max-w-[600px]">
                <Dialog.Header>
                    <Dialog.Title>Session History</Dialog.Title>
                    <Dialog.Description>
                        View your completed and interrupted sessions.
                    </Dialog.Description>
                </Dialog.Header>
                <HistoryDisplay />
            </Dialog.Content>
        </Dialog.Root>
    </div>
</main>
