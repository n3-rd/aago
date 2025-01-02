<script lang="ts">
    let { minutes, seconds } = $props<{ minutes: number; seconds: number }>();
</script>

<div class="text-6xl font-mono text-center my-4">
    {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
</div> 