# Pubmate Australia

A Vivacity Digital Expo app with standard navigation, theming, and UI scaffolding.

## Overview

- App slug: `pubmate-australia`
- iOS bundle ID: `com.vivacitydigital.pubmate`
- Android package: `com.vivacitydigital.pubmate`

## Quick start

```bash
npm install
npm run ios
```

## Scripts

- `npm run ios` - run on iOS simulator
- `npm run ios:simulator` - iOS with cache clear
- `npm run android` - run on Android emulator
- `npm run web` - run on web

## App Store prep (EAS)

```bash
eas build -p ios --profile production
eas submit -p ios --profile production
```
