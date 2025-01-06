<script lang="ts">
  import { getCurrentWindow } from '@tauri-apps/api/window';
  import { onMount } from 'svelte';
  import { Settings, History, Minus, Square, X } from 'lucide-svelte';
  import * as Dialog from "$lib/components/ui/dialog";
  import TimerSettings from '$lib/components/TimerSettings.svelte';
  import HistoryDisplay from '$lib/components/HistoryDisplay.svelte';
  import { timerSettings } from '$lib/stores/timerStore';
  import { timerStatusStore } from '$lib/stores/timerStatusStore';

  let appWindow: any;
  let historyOpen = false;
  let settingsOpen = false;

  onMount(async () => {
    appWindow = await getCurrentWindow();
  });

  async function minimize() {
    try {
      await appWindow?.minimize();
    } catch (error) {
      console.error('Failed to minimize window:', error);
    }
  }
  async function close() {
    try {
      await appWindow?.close();
    } catch (error) {
      console.error('Failed to close window:', error);
    }
  }

  function updateSettings(newSettings: any) {
    $timerSettings = newSettings;
    settingsOpen = false;
  }
</script>

<div data-tauri-drag-region class="titlebar">
  <div class="titlebar-left">
    <button class="titlebar-button" onclick={() => historyOpen = true}>
      <History class="w-4 h-4" />
    </button>
    <button 
      class="titlebar-button" 
      onclick={() => settingsOpen = true}
      disabled={$timerStatusStore !== 'stopped'}
      class:opacity-50={$timerStatusStore !== 'stopped'}
      class:cursor-not-allowed={$timerStatusStore !== 'stopped'}
    >
      <Settings class="w-4 h-4" />
    </button>
  </div>
  
  <div class="titlebar-right">
    <button 
      class="titlebar-button" 
      onclick={minimize}
      title="Minimize"
    >
      <Minus class="w-4 h-4" />
    </button>
    <button 
      class="titlebar-button close" 
      onclick={close}
      title="Close"
    >
      <X class="w-4 h-4" />
    </button>
  </div>
</div>

<Dialog.Root bind:open={historyOpen}>
  <Dialog.Content class="max-w-[90vw]">
    <Dialog.Header>
      <Dialog.Title>Session History</Dialog.Title>
      <Dialog.Description>
        View your completed and interrupted sessions.
      </Dialog.Description>
    </Dialog.Header>
    <HistoryDisplay />
  </Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={settingsOpen}>
  <Dialog.Content class="max-w-[90vw]">
    <Dialog.Header>
      <Dialog.Title>Timer Settings</Dialog.Title>
      <Dialog.Description>
        Adjust your timer durations and preferences.
      </Dialog.Description>
    </Dialog.Header>
    <TimerSettings onSave={updateSettings} />
  </Dialog.Content>
</Dialog.Root>

<style>
  .titlebar {
    height: 32px;
    background: hsl(var(--background));
    border-bottom: 1px solid hsl(var(--border));
    user-select: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
  }

  .titlebar-left, .titlebar-right {
    display: flex;
    align-items: center;
  }

  .titlebar-button {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    color: hsl(var(--foreground));
    background: transparent;
    border: none;
    cursor: pointer;
  }

  .titlebar-button:hover {
    background: hsl(var(--muted));
  }

  .close:hover {
    background: hsl(var(--destructive));
    color: hsl(var(--destructive-foreground));
  }

  .titlebar-button:disabled {
    pointer-events: none;
  }
</style> 