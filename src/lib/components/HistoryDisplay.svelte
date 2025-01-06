<script lang="ts">
    import { sessionHistory } from '$lib/stores/historyStore';
    import type { SessionHistory } from '$lib/types';
    import * as Dialog from "$lib/components/ui/dialog";
    import { Button } from "$lib/components/ui/button";
    import { Brain, Coffee, Battery } from 'lucide-svelte';

    function formatDate(dateString: string): string {
        return new Date(dateString).toLocaleString();
    }

    function formatDuration(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    function getTypeIcon(type: 'work' | 'break' | 'longBreak') {
        switch (type) {
            case 'work':
                return Brain;
            case 'break':
                return Coffee;
            case 'longBreak':
                return Battery;
        }
    }

    function getTypeColor(type: 'work' | 'break' | 'longBreak') {
        switch (type) {
            case 'work':
                return 'text-blue-600';
            case 'break':
                return 'text-green-600';
            case 'longBreak':
                return 'text-purple-600';
        }
    }
</script>

<div class="py-4">
    {#if $sessionHistory.length === 0}
        <div class="flex flex-col items-center justify-center py-12 text-gray-500">
            <span class="text-lg mb-2">No sessions recorded yet</span>
            <p class="text-sm text-center">Complete your first session to see it here</p>
        </div>
    {:else}
        <div class="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {#each $sessionHistory as session}
                <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <div class="flex justify-between items-start">
                        <div class="space-y-1">
                            <div class="flex items-center gap-2">
                                <svelte:component 
                                    this={getTypeIcon(session.type)} 
                                    class="w-4 h-4 {getTypeColor(session.type)}"
                                />
                                <h3 class="font-medium">
                                    {session.name || 'Unnamed Session'}
                                </h3>
                            </div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                Duration: {formatDuration(session.duration)}
                            </p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm text-gray-500">{formatDate(session.startTime)}</p>
                            <span class="inline-flex items-center px-2 py-1 mt-1 rounded-full text-xs {session.completed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}">
                                {session.completed ? '✓ Completed' : '○ Stopped'}
                            </span>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>

<Dialog.Footer class="flex justify-between">
    <p class="text-sm text-gray-500">
        Total sessions: {$sessionHistory.length}
    </p>
    <Button 
        variant="destructive" 
        onclick={() => sessionHistory.clearHistory()}
        class="px-3 py-1 h-8"
    >
        Clear History
    </Button>
</Dialog.Footer>

<style>
    .custom-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
    }
    
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: rgba(156, 163, 175, 0.5);
        border-radius: 3px;
    }
</style> 