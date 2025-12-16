# Store Assets Folder Structure

This folder contains all assets needed for Google Play Store submission.

## Required Assets Checklist

### Screenshots (Required)
Place in `screenshots/` folder:
- [ ] `phone_1.png` - Main map view (1080x1920 or 1080x2340)
- [ ] `phone_2.png` - Station details view
- [ ] `phone_3.png` - Trip tracking view
- [ ] `phone_4.png` - Profile/settings view
- [ ] `phone_5.png` - History view (optional)

**Requirements:**
- Minimum 2 screenshots, maximum 8
- JPEG or 24-bit PNG (no alpha)
- Minimum dimension: 320px, Maximum: 3840px
- Aspect ratio: 16:9 or 9:16

### Graphics (Required)
Place in `graphics/` folder:
- [ ] `feature_graphic.png` - 1024x500 px (displayed at top of store listing)
- [ ] `hi_res_icon.png` - 512x512 px (app icon for store)
- [ ] `promo_video.mp4` - YouTube URL (optional)

### Documents
- [x] `PRIVACY_POLICY.md` - English version ✅
- [x] `PRIVACY_POLICY_PT.md` - Portuguese version ✅
- [x] `STORE_LISTING.md` - App descriptions and metadata ✅

## Data Safety Form Responses

When filling out the Data Safety form in Google Play Console, use these responses:

### Data Collection
| Question | Answer |
|----------|--------|
| Does your app collect or share user data? | Yes |
| Is all data encrypted in transit? | Yes |
| Do you provide a way for users to request data deletion? | Yes (via device settings) |

### Data Types
| Data Type | Collected | Shared | Purpose |
|-----------|-----------|--------|---------|
| Precise location | Yes | No | App functionality |
| Approximate location | Yes | No | App functionality |
| Email address | Yes (passed through) | No | Account authentication |

### Security Practices
| Practice | Status |
|----------|--------|
| Data is encrypted in transit | Yes |
| Data is encrypted at rest | N/A (no server storage) |
| Users can request data deletion | Yes |
| Data handling is disclosed | Yes (Privacy Policy) |

## Release Checklist

Before submitting to Google Play:

1. [ ] All screenshots captured and placed in `screenshots/`
2. [ ] Feature graphic created and placed in `graphics/`
3. [ ] Privacy Policy hosted at a public URL
4. [ ] APK/AAB generated with correct signing key
5. [ ] Version code incremented
6. [ ] Data Safety form completed in Play Console
7. [ ] Content rating questionnaire completed
8. [ ] Store listing text reviewed for policy compliance
