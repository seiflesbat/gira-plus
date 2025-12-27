<script lang="ts">
	import { version } from "$app/environment";
	import { safeInsets } from "$lib/ui.svelte";
	import MenuPage from "$lib/components/MenuPage.svelte";
	import { t, getLocale } from "$lib/translations";
</script>

<MenuPage>
	<div
		class="flex flex-col items-center justify-center p-5 relative grow"
		style:padding-bottom="{Math.max($safeInsets.bottom, 20)}px"
		style:direction={getLocale() === "ar" ? "rtl" : "ltr"}
	>
		<!-- App Title -->
		<div class="text-center mb-6">
			<h1 class="text-4xl font-bold text-info mb-2">Gira++</h1>
			<span class="text-sm text-label">v{version}</span>
		</div>

		<!-- Quran Verse (shown for all languages, styled for Arabic) -->
		<div class="text-center max-w-sm mb-6 px-4">
			<p
				class="text-sm text-primary/80 leading-relaxed mb-1 {getLocale() ===
				'ar'
					? 'text-lg font-medium'
					: 'italic'}"
			>
				{$t("quran_verse")}
			</p>
			<span class="text-xs text-label/70">
				{$t("quran_reference")}
			</span>
		</div>

		<!-- Quote -->
		<div class="text-center max-w-xs mb-8">
			<p class="text-sm text-label italic leading-relaxed">
				{$t("about_quote")}
			</p>
		</div>

		<!-- Made By -->
		<div class="text-center mb-8">
			<span
				class="text-xs text-label uppercase tracking-widest mb-2 block"
			>
				{$t("made_by")}
			</span>
			<span class="text-lg font-semibold text-info"
				>{$t("author_name")}</span
			>
		</div>

		<!-- Disclaimer -->
		<div class="text-center max-w-xs">
			<p class="text-xs text-label leading-relaxed">
				{$t("modified_app_disclaimer")}
			</p>
		</div>
	</div>
</MenuPage>
