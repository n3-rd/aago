<script lang="ts">
    let props = $props<{
        currentName: string;
        onNameChange: (name: string) => void;
    }>();
</script>

<div class="flex items-center justify-center gap-2 my-4">
    <input
        type="text"
        bind:value={props.currentName}
        placeholder="Session name"
        class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        on:change={(e) => props.onNameChange(e.currentTarget.value)}
    />
</div> 