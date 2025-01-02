<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { timerSettings } from '$lib/stores/timerStore';
    import type { TimerSettings } from '$lib/types';
    import * as Dialog from "$lib/components/ui/dialog";
    
    let { onSave } = $props<{ onSave: (settings: TimerSettings) => void }>();
    let settings = $state<TimerSettings>($timerSettings);
    
    function handleSave() {
        onSave(settings);
    }
</script>

<div class="grid gap-4 py-4">
    <div class="grid grid-cols-4 items-center gap-4">
        <Label for="workDuration" class="text-right">Work Duration</Label>
        <Input
            id="workDuration"
            type="number"
            bind:value={settings.workDuration}
            min="1"
            max="60"
            class="col-span-3"
        />
    </div>
    
    <div class="grid grid-cols-4 items-center gap-4">
        <Label for="breakDuration" class="text-right">Break Duration</Label>
        <Input
            id="breakDuration"
            type="number"
            bind:value={settings.breakDuration}
            min="1"
            max="30"
            class="col-span-3"
        />
    </div>
    
    <div class="grid grid-cols-4 items-center gap-4">
        <Label for="longBreakDuration" class="text-right">Long Break</Label>
        <Input
            id="longBreakDuration"
            type="number"
            bind:value={settings.longBreakDuration}
            min="1"
            max="60"
            class="col-span-3"
        />
    </div>
    
    <div class="grid grid-cols-4 items-center gap-4">
        <Label for="sessionsBeforeLongBreak" class="text-right">Sessions Before Long Break</Label>
        <Input
            id="sessionsBeforeLongBreak"
            type="number"
            bind:value={settings.sessionsBeforeLongBreak}
            min="1"
            max="10"
            class="col-span-3"
        />
    </div>
</div>

<Dialog.Footer>
    <Dialog.Close>
        <Button onclick={handleSave} data-dialog-close>Save Settings</Button>
    </Dialog.Close>
</Dialog.Footer> 