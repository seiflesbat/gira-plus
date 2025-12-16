<script lang="ts">
	import { version } from "$app/environment";
	import { safeInsets } from "$lib/ui.svelte";
	import MenuPage from "$lib/components/MenuPage.svelte";
	import { t } from "$lib/translations";
	import { IconMail, IconTool, IconQuote } from "@tabler/icons-svelte";
</script>

<MenuPage>
	<div
		class="flex flex-col p-5 relative grow overflow-y-auto"
		style:padding-bottom="{Math.max($safeInsets.bottom, 20)}px"
	>
		<div class="text-3xl font-bold text-info pl-2 mb-6">
			{$t("about_label")}
		</div>

		<div class="flex flex-col gap-5">
			<!-- App Header Card -->
			<div
				class="bg-background-secondary dark:bg-background-tertiary rounded-2xl p-5"
			>
				<div class="flex items-center gap-4 mb-3">
					<img
						src="/assets/giraplus_icon.png"
						alt="Gira++"
						class="w-16 h-16 rounded-2xl"
					/>
					<div>
						<span class="text-xl font-bold text-primary block"
							>Gira++</span
						>
						<span class="text-sm text-label">v{version}</span>
					</div>
				</div>
				<p class="text-sm text-info leading-relaxed">
					{$t("app_description")}
				</p>
			</div>

			<!-- Inspirational Quote -->
			<div
				class="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-5"
			>
				<div class="flex gap-3 items-start">
					<IconQuote
						size={24}
						stroke={1.5}
						class="text-primary shrink-0 mt-1"
					/>
					<div>
						<p class="text-sm text-info leading-relaxed italic">
							"Sometimes the best solutions come from those who
							simply refuse to accept that something is broken."
						</p>
						<span class="text-xs text-label mt-2 block"
							>— The spirit of open source</span
						>
					</div>
				</div>
			</div>

			<!-- Developer Section -->
			<div
				class="bg-background-secondary dark:bg-background-tertiary rounded-2xl p-5"
			>
				<span
					class="text-xs font-bold text-label uppercase tracking-wide mb-3 block"
				>
					{$t("made_by")}
				</span>
				<div class="flex gap-4 items-center">
					<img
						src="/assets/developer_avatar.png"
						alt="Seif Lesbat"
						class="w-16 h-16 rounded-full object-cover shadow-lg"
						style="border: 1px solid #D4AF37; box-shadow: 0 0 8px rgba(212, 175, 55, 0.3);"
					/>
					<div class="flex flex-col">
						<span class="font-bold text-primary">Seif Lesbat</span>
						<a
							href="mailto:Algorise@usa.com"
							class="text-sm text-label hover:text-info transition-colors flex items-center gap-1"
						>
							<IconMail size={14} stroke={1.5} />
							Algorise@usa.com
						</a>
					</div>
				</div>
				<p class="text-sm text-info leading-relaxed mt-3">
					{$t("developer_bio")}
				</p>
			</div>

			<!-- Disclaimer - This is the main focus -->
			<div class="bg-warning/10 border border-warning/30 rounded-2xl p-5">
				<span
					class="text-xs font-bold text-warning uppercase tracking-wide mb-3 block flex items-center gap-2"
				>
					<IconTool size={16} stroke={2} />
					{$t("disclaimer_title")}
				</span>
				<p class="text-sm text-info leading-relaxed">
					{$t("modified_app_disclaimer")}
				</p>
			</div>

			<!-- Footer -->
			<div class="text-center py-4">
				<span class="text-xs text-label"
					>{$t("open_source_license")}</span
				>
			</div>
		</div>
	</div>
</MenuPage>
