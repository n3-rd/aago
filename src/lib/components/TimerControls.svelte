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

<div class="flex gap-4 justify-center my-4">
    {#if props.status === 'stopped' || props.status === 'paused'}
        <Button
            onclick={props.onStart}
            class="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-3xl"
        >
            <!-- {props.status === 'stopped' ? 'Start' : 'Resume'} -->
            <Play class="w-6 h-6" />
        </Button>
    {/if}
    
    {#if props.status === 'running'}
        <Button
            onclick={props.onPause}
            class=" text-white px-6 py-4 rounded-3xl"
        >
            <!-- Pause -->
            <Pause class="w-6 h-6" />
        </Button>
    {/if}
    
    {#if props.status !== 'stopped' && props.status == 'paused'}
        <Button
            onclick={props.onReset}
            class="bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-3xl"
        >
            <!-- Reset -->
            <RefreshCcw class="w-6 h-6" />
        </Button>
    {/if}
</div> 