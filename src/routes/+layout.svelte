<script lang="ts">
	import '../app.css';
	import TitleBar from '$lib/components/TitleBar.svelte';
</script>

<TitleBar />

<main class="pt-[32px]">
	<slot />
</main>
