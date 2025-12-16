# Changelog

All notable changes to this project will be documented in this file.

## [2.4.0] - 2025-12-16

### 🔒 Privacy Overhaul
- **REMOVED** all telemetry and analytics
- **REMOVED** third-party server connections
- **REMOVED** device tracking and fingerprinting
- App now only communicates with official EMEL/Gira API

### ✨ Improvements
- Refactored codebase for better performance
- Added proper TypeScript types throughout
- Improved code documentation with JSDoc
- Fixed variable shadowing bug in token refresh
- Optimized settings storage with parallel writes

### 🧹 Cleanup
- Removed 8 unused imports from account module
- Removed unused settings (analytics, reportRatings)
- Removed update warning feature (used external repo)
- Cleaned up WebSocket connection code

## [2.3.0] - 2025-12-16

### ✨ Features
- Added developer profile picture with golden border
- Updated About page avatar styling

## [2.2.0] - 2025-12-16

### 🐛 Bug Fixes
- Fixed package ID to `com.algorise.giraplus`

## [2.1.0] - 2025-12-15

### ✨ Features
- Complete translation coverage for 9 languages
- Improved welcome experience

### 🌍 Languages
- English
- Portuguese
- Spanish
- French
- German
- Italian
- Arabic
- Russian
- Hindi
