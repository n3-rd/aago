<script lang="ts">
    let props = $props<{
        status: 'running' | 'paused' | 'stopped';
        onStart: () => void;
        onPause: () => void;
        onReset: () => void;
    }>();
</script>

<div class="flex gap-4 justify-center my-4">
    {#if props.status === 'stopped' || props.status === 'paused'}
        <button
            onclick={props.onStart}
            class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
            {props.status === 'stopped' ? 'Start' : 'Resume'}
        </button>
    {/if}
    
    {#if props.status === 'running'}
        <button
            onclick={props.onPause}
            class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
        >
            Pause
        </button>
    {/if}
    
    {#if props.status !== 'stopped'}
        <button
            onclick={props.onReset}
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
            Reset
        </button>
    {/if}
</div> 