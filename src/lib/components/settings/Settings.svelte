<script>
	import { dev } from "$app/environment";
	import { LOCK_DISTANCE_m } from "$lib/constants";
	import { appSettings } from "$lib/settings";
	import MenuPage from "$lib/components/MenuPage.svelte";
	import Toggle from "$lib/components/Toggle.svelte";
	import { t } from "$lib/translations";
</script>

<MenuPage>
	<div class="flex flex-col p-5 gap-8 grow">
		<div class="text-3xl font-bold text-info pt-1">
			{$t("settings_label")}
		</div>

		<!-- UI Settings Section -->
		<div class="flex flex-col gap-4">
			<div class="text-lg font-semibold text-info px-2">
				{$t("ui_settings_section")}
			</div>
			<div class="flex flex-col gap-2">
				<div
					class="flex bg-background rounded-2xl py-4 px-5 gap-5 text-info justify-between items-center dark:bg-background-secondary"
					style:box-shadow="0px 0px 12px 0px var(--color-shadow)"
				>
					<div class="grow">
						<div class="font-semibold leading-tight mb-1">
							{$t("locale_setting_label")}
						</div>
						<div
							class="text-xs font-medium leading-[1.1] text-label"
						>
							{$t("locale_setting_description")}
						</div>
					</div>
					<select
						bind:value={$appSettings.locale}
						class="bg-background-secondary dark:bg-background-tertiary rounded-xl border-none focus:ring-0 text-sm"
					>
						<option value="system">{$t("system_locale")}</option>
						<option value="en">English</option>
						<option value="pt">Português</option>
						<option value="es">Español</option>
						<option value="fr">Français</option>
						<option value="de">Deutsch</option>
						<option value="it">Italiano</option>
						<option value="ar">العربية</option>
						<option value="ru">Русский</option>
						<option value="hi">हिन्दी</option>
					</select>
				</div>
				<div
					class="flex bg-background rounded-2xl py-4 px-5 gap-5 text-info justify-between items-center dark:bg-background-secondary"
					style:box-shadow="0px 0px 12px 0px var(--color-shadow)"
				>
					<div class="grow">
						<div class="font-semibold leading-tight mb-1">
							{$t("theme_setting_label")}
						</div>
						<div
							class="text-xs font-medium leading-[1.1] text-label"
						>
							{$t("theme_setting_description")}
						</div>
					</div>
					<select
						bind:value={$appSettings.theme}
						class="bg-background-secondary dark:bg-background-tertiary rounded-xl border-none focus:ring-0 text-sm"
					>
						<option value="system">{$t("system_theme")}</option>
						<option value="daylight">{$t("daylight_theme")}</option>
						<option value="light">{$t("light_theme")}</option>
						<option value="dark">{$t("dark_theme")}</option>
					</select>
				</div>
			</div>
		</div>

		<!-- Location Settings Section -->
		<div class="flex flex-col gap-4">
			<div class="text-lg font-semibold text-info px-2">
				{$t("location_settings_section")}
			</div>
			<div class="flex flex-col gap-2">
				<div
					class="flex bg-background rounded-2xl py-4 px-5 gap-5 text-info justify-between items-center dark:bg-background-secondary"
					style:box-shadow="0px 0px 12px 0px var(--color-shadow)"
				>
					<div class="grow">
						<div class="font-semibold leading-tight mb-1">
							{$t("lock_distance_setting_label")}
						</div>
						<div
							class="text-xs font-medium leading-[1.1] text-label"
						>
							{$t("lock_distance_setting_description", {
								distance: LOCK_DISTANCE_m.toString(),
							})}
						</div>
					</div>
					<Toggle bind:checked={$appSettings.distanceLock} />
				</div>
				<div
					class="flex bg-background rounded-2xl py-4 px-5 gap-5 text-info justify-between items-center dark:bg-background-secondary"
					style:box-shadow="0px 0px 12px 0px var(--color-shadow)"
				>
					<div class="grow">
						<div class="font-semibold leading-tight mb-1">
							{$t("background_location_setting_label")}
						</div>
						<div
							class="text-xs font-medium leading-[1.1] text-label"
						>
							{$t("background_location_setting_description")}
						</div>
					</div>
					<Toggle bind:checked={$appSettings.backgroundLocation} />
				</div>
			</div>
		</div>

		<!-- Privacy Section -->
		<div class="flex flex-col gap-4">
			<div class="text-lg font-semibold text-info px-2">
				{$t("privacy_section")}
			</div>
			<div class="flex flex-col gap-2">
				<div
					class="bg-background rounded-2xl py-5 px-5 text-info dark:bg-background-secondary"
					style:box-shadow="0px 0px 12px 0px var(--color-shadow)"
				>
					<div class="font-semibold leading-tight mb-2 text-primary">
						🔒 {$t("privacy_title")}
					</div>
					<div class="text-sm font-medium leading-relaxed text-label">
						{$t("privacy_message")}
					</div>
				</div>
			</div>
		</div>

		{#if dev}
			<!-- Development Section -->
			<div class="flex flex-col gap-4">
				<div class="text-lg font-semibold text-info px-2">
					{$t("development_settings_section")}
				</div>
				<div class="flex flex-col gap-2">
					<div
						class="flex bg-background rounded-2xl py-4 px-5 gap-5 text-info justify-between items-center dark:bg-background-secondary"
						style:box-shadow="0px 0px 12px 0px var(--color-shadow)"
					>
						<div class="grow">
							<div class="font-semibold leading-tight mb-1">
								{$t("mock_unlock_setting_label")}
							</div>
							<div
								class="text-xs font-medium leading-[1.1] text-label"
							>
								{$t("mock_unlock_setting_description")}
							</div>
						</div>
						<Toggle bind:checked={$appSettings.mockUnlock} />
					</div>
				</div>
			</div>
		{/if}
	</div>
</MenuPage>
