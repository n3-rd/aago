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

<main class="container mx-auto px-4 py-8 max-w-2xl">
    <h1 class="text-3xl font-bold text-center mb-8">Pomodoro Timer</h1>
    
    <div class="text-center mb-4 flex justify-center items-center">
        <div class="flex items-center gap-2">
            {#if timerState === 'work'}
                <Brain class="w-5 h-5 text-blue-600" />
                <span class="text-lg font-semibold text-blue-600">Work Time</span>
            {:else if timerState === 'break'}
                <Coffee class="w-5 h-5 text-green-600" />
                <span class="text-lg font-semibold text-green-600">Break Time</span>
            {:else}
                <Battery class="w-5 h-5 text-purple-600" />
                <span class="text-lg font-semibold text-purple-600">Long Break</span>
            {/if}
        </div>
        <span class="text-sm ml-2">
            ({sessionName || `Session ${Math.floor(completedSessions / $timerSettings.sessionsBeforeLongBreak) + 1}`})
        </span>

        <Dialog.Root>
            <Dialog.Trigger>
                <Button variant="ghost" class="ml-4 h-8 w-8 bg-transparent rounded-full text-gray-800 px-2 py-1"> 
                    <Pencil class="w-6 h-6" />
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

    <div class="flex justify-center gap-4 mt-8">
        <Dialog.Root>
            <Dialog.Trigger>
                <Button variant="outline">Settings</Button>
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
                <Button variant="outline">History</Button>
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
