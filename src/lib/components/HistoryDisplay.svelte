<script lang="ts">
    import { sessionHistory } from '$lib/stores/historyStore';
    import type { SessionHistory } from '$lib/types';
    import * as Dialog from "$lib/components/ui/dialog";
    import { Button } from "$lib/components/ui/button";

    function formatDate(dateString: string): string {
        return new Date(dateString).toLocaleString();
    }

    function formatDuration(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
</script>

<div class="py-4">
    {#if $sessionHistory.length === 0}
        <p class="text-center text-gray-500">No sessions recorded yet</p>
    {:else}
        <div class="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
            {#each $sessionHistory as session}
                <div class="bg-gray-100 p-4 rounded-lg">
                    <div class="flex justify-between items-center">
                        <div>
                            <h3 class="font-semibold">
                                {session.name || 'Unnamed Session'}
                                <span class="text-sm text-gray-500 ml-2">
                                    ({session.type})
                                </span>
                            </h3>
                            <p class="text-sm text-gray-600">
                                Duration: {formatDuration(session.duration)}
                            </p>
                        </div>
                        <div class="text-right text-sm text-gray-500">
                            <p>{formatDate(session.startTime)}</p>
                            <p class="text-xs">
                                {session.completed ? '✅ Completed' : '⏹️ Stopped'}
                            </p>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>

<Dialog.Footer>
    <Button variant="outline" onclick={() => sessionHistory.clearHistory()}>
        Clear History
    </Button>
</Dialog.Footer> 