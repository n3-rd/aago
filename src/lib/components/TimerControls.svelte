<script lang="ts">
     import { Button } from "$lib/components/ui/button/index";
     import { Pause, Play, RefreshCcw } from 'lucide-svelte';
    let props = $props<{
        status: 'running' | 'paused' | 'stopped';
        onStart: () => void;
        onPause: () => void;
        onReset: () => void;
    }>();
</script>

<div class="flex gap-3 justify-center my-8">
    {#if props.status === 'stopped' || props.status === 'paused'}
        <Button
            onclick={props.onStart}
            class="bg-gray-100 hover:bg-gray-200 text-gray-600 p-3 rounded-full transition-all duration-300 hover:scale-105 animate-in fade-in-50"
        >
            <Play class="w-5 h-5" />
        </Button>
    {/if}
    
    {#if props.status === 'running'}
        <Button
            onclick={props.onPause}
            class="bg-gray-100 hover:bg-gray-200 text-gray-600 p-3 rounded-full transition-all duration-300 hover:scale-105 animate-in fade-in-50"
        >
            <Pause class="w-5 h-5" />
        </Button>
    {/if}
    
    {#if props.status !== 'stopped' && props.status == 'paused'}
        <Button
            onclick={props.onReset}
            class="bg-gray-100 hover:bg-gray-200 text-gray-600 p-3 rounded-full transition-all duration-300 hover:scale-105 animate-in fade-in-50"
        >
            <RefreshCcw class="w-5 h-5" />
        </Button>
    {/if}
</div> 