<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";
    import { Button } from "$lib/components/ui/button";
    let props = $props<{
        currentName: string;
        onNameChange: (name: string) => void;
    }>();

    let inputValue = $state(props.currentName);

    function handleSubmit() {
        if (inputValue.trim()) {  // Only update if there's a non-empty value
            props.onNameChange(inputValue);
        }
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    }
</script>

<div class="flex items-center justify-center gap-2">
    <input
        type="text"
        bind:value={inputValue}
        placeholder="Session name"
        class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        onkeydown={handleKeyDown}
        autofocus
    />
    <Dialog.Close>
        <Button onclick={handleSubmit}>Save</Button>
    </Dialog.Close>
</div> 