<div align="center">

# Gira++

### *The Definitive Lisbon Bike-Sharing Experience*

**Privacy-first. Blazing fast. Beautifully crafted.**

**[Visit Website](https://seiflesbat.github.io/gira-plus/) · [Download APK](../../releases/latest) · [FAQ](docs/FAQ.md)**

[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Android-blue.svg)]()
[![Privacy](https://img.shields.io/badge/Tracking-None-brightgreen.svg)]()
[![Version](https://img.shields.io/badge/Version-3.7.0-orange.svg)]()

<br>

<img src="screenshots/map_overview.jpg" width="200" alt="Map Overview">
&nbsp;&nbsp;&nbsp;
<img src="screenshots/station_view.jpg" width="200" alt="Station Details">
&nbsp;&nbsp;&nbsp;
<img src="screenshots/settings.jpg" width="200" alt="Settings">

</div>

---

## Overview

Gira++ is a complete reimagining of the Lisbon bike-sharing experience. Built from the ground up with a focus on privacy, performance, and user experience, it delivers everything the official app should be—without the tracking, bloat, or frustration.

This is not just another fork. It's a statement: software can be both powerful and respectful of its users.

---

## What's New in v3.7.0

### 10 Languages - Now with Chinese Support
Gira++ now speaks to the world! We've expanded from 3 to 10 fully translated languages including English, Portuguese, Spanish, French, German, Italian, Arabic (with RTL), Russian, Hindi, and Chinese (Simplified). Every string, every button, every message—professionally translated.

---

## Core Principles

### Privacy Without Compromise
Zero tracking. Zero analytics. Zero data collection. The app communicates only with the official EMEL/Gira API—nothing else touches the network.

### Performance That Respects Your Time
17 MB package. Instant station loading. Real-time WebSocket updates. No background processes draining your battery.

### Internationalization
Full translations in 10 languages: English, Portuguese, Spanish, French, German, Italian, Arabic (RTL), Russian, Hindi, and Chinese. Every string, every corner of the interface.

---

## Screenshots

<div align="center">

| Map View | Station Details | Destination Finder |
|:--------:|:---------------:|:------------------:|
| <img src="screenshots/map_overview.jpg" width="180"> | <img src="screenshots/station_view.jpg" width="180"> | <img src="screenshots/destination_finder.jpg" width="180"> |

| Profile | Settings | About |
|:-------:|:--------:|:-----:|
| <img src="screenshots/profile.jpg" width="180"> | <img src="screenshots/settings.jpg" width="180"> | <img src="screenshots/about_page.jpg" width="180"> |

</div>

---

## Features

**Interactive Map**
- Real-time station availability with bikes/docks display
- Favorite station highlighting in red
- Clean, distraction-free interface
- Smooth navigation and zoom

**Destination Finder**
- Address search with autocomplete
- Nearest stations with dock availability
- Click-to-view with map fly animation
- Search history and saved addresses

**Trip Management**
- One-tap bike unlock
- Smart 35m distance limiting
- Complete ride history
- Active trip notifications

**Customization**
- Light and dark themes
- 10 language options (EN, PT, ES, FR, DE, IT, AR, RU, HI, ZH)
- Background location toggle
- Minimal, focused settings

---

## Download

### Latest Release: v3.7.0

[**Download APK**](../../releases/latest)

Requirements: Android 7.0+ (API 24)

---

## Building from Source

```bash
git clone https://github.com/SeifLesbat/gira-plus.git
cd gira-plus

npm install
npm run build
npx cap sync android

cd android && ./gradlew assembleDebug
```

---

## Technology

| Component | Technology |
|-----------|------------|
| Framework | SvelteKit 5 |
| Native Bridge | Capacitor |
| Maps | MapLibre GL |
| Language | TypeScript |
| Build | Vite |

---

## Contributing

Contributions are welcome. Fork the repository, create a feature branch, and submit a pull request.

---

## Legal Notice

Gira++ is an independent, open-source project. It is not affiliated with, endorsed by, or connected to EMEL, Gira, or Câmara Municipal de Lisboa.

This software is provided as-is, without warranty of any kind. Users assume all responsibility for its use. The developers are not liable for any damages arising from the use of this application.

The app interacts with the official Gira/EMEL API. Service availability depends on third-party infrastructure outside our control.

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

<div align="center">

**Built for Lisbon cyclists who deserve better.**

*[Seif Lesbat](mailto:Algorise@usa.com)*

</div>