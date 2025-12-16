<script lang="ts">
	import { onMount } from "svelte";

	/**
	 * InfoDialog Component
	 *
	 * Previously displayed update notifications and remote messages.
	 * Simplified for privacy - no longer connects to external servers.
	 */

	let show = $state(false);

	onMount(() => {
		// Component initialized but no external calls made
		// This preserves the component structure for potential future use
	});
</script>

{#if show}
	<!-- Reserved for future in-app notifications -->
{/if}
