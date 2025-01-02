<script lang="ts">
    import { timerSettings } from '$lib/stores/timerStore';
    import type { TimerSettings } from '$lib/types';
    
    let { onSave } = $props<{ onSave: (settings: TimerSettings) => void }>();
    let settings = $state<TimerSettings>($timerSettings);
    
    function handleSave() {
        onSave(settings);
    }
</script>

<div class="max-w-md mx-auto p-4 bg-gray-100 rounded-lg my-4">
    <h2 class="text-xl font-bold mb-4">Timer Settings</h2>
    
    <div class="space-y-4">
        <div>
            <label class="block text-sm font-medium">Work Duration (minutes)</label>
            <input
                type="number"
                bind:value={settings.workDuration}
                min="1"
                max="60"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
        </div>
        
        <div>
            <label class="block text-sm font-medium">Break Duration (minutes)</label>
            <input
                type="number"
                bind:value={settings.breakDuration}
                min="1"
                max="30"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
        </div>
        
        <div>
            <label class="block text-sm font-medium">Long Break Duration (minutes)</label>
            <input
                type="number"
                bind:value={settings.longBreakDuration}
                min="1"
                max="60"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
        </div>
        
        <div>
            <label class="block text-sm font-medium">Sessions Before Long Break</label>
            <input
                type="number"
                bind:value={settings.sessionsBeforeLongBreak}
                min="1"
                max="10"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
        </div>
        
        <button
            onclick={handleSave}
            class="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
            Save Settings
        </button>
    </div>
</div> 