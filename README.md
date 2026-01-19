# PubMate Australia

<div align="center">

🍺 **Discover the best pubs, bars, and specials across Australia** 🍺

[![React Native](https://img.shields.io/badge/React%20Native-0.73.6-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~50.0.0-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.7.0-orange.svg)](https://firebase.google.com/)

</div>

---

## 📱 About PubMate

**PubMate Australia** is a comprehensive mobile application that helps Australians discover the best pubs, bars, and drink specials in their local area. With personalized recommendations, real-time special alerts, and a vibrant community of pub enthusiasts, PubMate makes it easy to find your next great night out.

### 🎯 Key Features

- **🗺️ Interactive Venue Discovery** - Map and list views with advanced filtering
- **🔍 Smart Search** - Find venues by location, category, amenities, and more
- **⭐ Personalized Recommendations** - AI-powered suggestions based on your preferences
- **🎉 Events & Specials** - Never miss a happy hour, trivia night, or live music event
- **💰 Credit System** - Earn and redeem credits at participating venues ($10 signup bonus!)
- **📝 Reviews & Ratings** - 7-star rating system with community reviews
- **🌙 Dark Mode** - Beautiful light and dark themes
- **🔔 Smart Notifications** - Real-time alerts for nearby specials and events
- **📊 Venue Owner Dashboard** - Analytics and insights for business owners
- **📸 Photo Uploads** - Share venue photos with the community
- **🔗 Deep Linking** - Share venues, events, and specials seamlessly

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**

- React Native 0.73.6 with Expo ~50.0.0
- TypeScript 5.3.3 (strict mode)
- React Navigation 6.x for navigation
- React Native Paper 5.x (Material Design 3)

**State Management:**

- Redux Toolkit 2.0.1
- 9 Redux slices (auth, user, venue, event, payment, review, theme, venueOwner)
- Async thunks for API calls
- Typed hooks (useAppDispatch, useAppSelector)

**Backend & Services:**

- Firebase Authentication (Email, Phone, Social)
- Cloud Firestore for data storage
- Firebase Storage for images
- Cloud Functions for backend logic

**Maps & Location:**

- React Native Maps (native)
- Leaflet (web fallback)
- Geolocation API

**Additional Libraries:**

- libphonenumber-js for phone validation
- react-native-country-picker-modal for country selection
- @react-native-community/datetimepicker
- expo-linear-gradient for gradients

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator
- Firebase project with Authentication enabled

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd vdapp1-pubmate-australia
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Install optional packages** (for full functionality)

   ```bash
   # For photo uploads
   npm install expo-image-picker expo-image-manipulator

   # For Firebase Storage (photos)
   npm install @react-native-firebase/storage

   # For clipboard functionality
   npm install expo-clipboard
   ```

4. **Configure Firebase**

   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password, Phone, Google, Apple, Facebook)
   - Enable Firestore Database
   - Enable Storage
   - Update `src/config/firebase.ts` with your credentials

5. **Start the development server**

   ```bash
   npm start
   ```

6. **Run on a device/simulator**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on physical device

---

## 📲 Features In Detail

### 🔐 Authentication & Onboarding (11 Steps)

1. Welcome screen with $10 signup bonus offer
2. Email/password signup or social sign-in
3. Age verification (18+ required)
4. Phone number verification (SMS)
5. User profile creation
6. Location selection (11 Australian cities)
7. Food & drink preferences (21 categories)
8. Optional payment method
9. Interactive app tour

**Supported Auth Methods:**

- Email & Password
- Phone (SMS verification)
- Apple Sign In
- Google Sign In
- Facebook Login

### 🏠 Home & Discovery

**Interactive Map View:**

- Real-time venue markers with special indicators
- Tap markers to view venue details
- Zoom and pan to explore areas
- Insider picks highlighted

**List View:**

- Venue cards with images and ratings
- Distance from current location
- Special count badges
- Quick favorite toggle

**Smart Filters:**

- **What:** All specials, insider picks, venues, trivia, events
- **Where:** Nearest, or 11 Australian cities
- **When:** Now, all days, specific days
- **Advanced:** Distance (1-20km), rating (1-7 stars), amenities, price range, open now

**Saved Searches:**

- Save complex filter combinations
- One-tap to re-apply filters
- View result counts
- Manage all saved searches

### 🎉 Events

- Browse events by category (Sports, Entertainment, Trivia, Food/Drink)
- Mark as "Going" or "Interested"
- See attendance counts
- Set reminders
- Share with friends

### 💳 Credits & Payments

- $10 signup bonus (90-day expiry)
- Referral program (Give $10, Get $10)
- Transaction history with filters
- Add multiple payment cards
- Secure tokenized storage

### ⭐ Reviews & Ratings

**7-Star System:**

1. Terrible • 2. Poor • 3. Average • 4. Good • 5. Great • 6. Excellent • 7. Perfect

**Features:**

- Write detailed reviews
- Helpful/Not Helpful voting
- Report inappropriate reviews
- Venue owner responses

### 👤 Profile & Settings

- Edit profile, preferences, notifications
- Dark/light theme toggle (auto-detect system preference)
- Saved searches management
- Payment methods management
- Credits & transaction history
- Activity history with filtering
- List a venue (for owners)
- Contact support

### 📊 Venue Owner Dashboard

**Analytics & Insights:**

- Real-time analytics (views, engagement, ratings)
- Period selection (today, week, month, year)
- Trend tracking with percentage changes
- Customer demographics
- Competitor analysis
- Special performance metrics

**Insights:**

- Peak hours identification
- Popular days analysis
- Top-performing specials
- Actionable recommendations
- Review response tracking

**Special Performance:**

- Views, saves, and conversion tracking
- Revenue estimation
- Performance trends (up/down/stable)
- Conversion rate analysis

### 📜 Activity History

**Timeline Features:**

- Chronological activity feed
- Grouped by date (Today, Yesterday, dates)
- Filter by activity type
- Activity statistics dashboard

**Tracked Activities:**

- Venue visits and favorites
- Reviews submitted
- Specials saved and redeemed
- Events attended
- Credits earned/spent
- Badges earned
- Referrals sent

### 📸 Photo Uploads

**Features:**

- Take photos with camera or choose from gallery
- Upload up to 5 photos per venue
- Add captions to photos
- Photo guidelines and validation
- Progress tracking during upload
- View all venue photos in gallery
- Filter by "My Photos" or "Popular"
- Full-screen photo viewer with zoom

**Supported:**

- Max 10MB per photo
- JPEG, PNG, WebP formats
- Automatic compression and thumbnail generation
- Firebase Storage integration

### 🔗 Deep Linking

**Custom Scheme Links:**

- `pubmate://venue/{id}` - Open venue details
- `pubmate://event/{id}` - Open event details
- `pubmate://special/{id}` - Open special details
- `pubmate://referral/{code}` - Open signup with referral

**Universal Links:**

- `https://pubmate.app/venue/{id}`
- `https://pubmate.app/event/{id}`
- Works on web and opens app when installed

**Share Functionality:**

- Share venues, events, and specials
- Copy link to clipboard
- Integration with native share sheet
- Referral link generation

**Additional Links:**

- Open phone dialer
- Open email client
- Open maps with directions
- Open external URLs

---

## 📊 Project Structure

```
vdapp1-pubmate-australia/
├── src/
│   ├── api/                    # API client configuration
│   ├── components/             # Reusable UI components (25+)
│   │   ├── auth/              # Auth components
│   │   ├── venue/             # Venue discovery
│   │   ├── event/             # Event components
│   │   ├── review/            # Review & rating
│   │   ├── photo/             # Photo upload & gallery
│   │   └── common/            # Common components
│   ├── config/                # App configuration
│   ├── hooks/                 # Custom React hooks
│   │   └── useDeepLink.ts    # Deep linking hook
│   ├── navigation/            # Navigation setup
│   ├── screens/               # 45+ screen components
│   │   ├── auth/             # 11 onboarding screens
│   │   ├── venue/            # Venue details & photos
│   │   ├── event/            # Event details
│   │   ├── payment/          # Payment & credits
│   │   ├── profile/          # Profile & activity history
│   │   └── review/           # Review submission
│   ├── services/              # Business logic
│   │   ├── VenueService.ts   # Venue data & filtering
│   │   ├── EventService.ts   # Event management
│   │   ├── PhotoService.ts   # Photo upload
│   │   ├── ActivityService.ts # Activity tracking
│   │   ├── DeepLinkService.ts # Deep linking
│   │   ├── VenueOwnerService.ts # Owner analytics
│   │   └── RecommendationService.ts  # Personalization
│   ├── store/                 # Redux state
│   │   └── slices/           # 9 Redux slices
│   ├── theme/                 # Light/dark themes
│   ├── types/                 # TypeScript definitions
│   └── utils/                 # Utility functions
├── assets/                    # Images, fonts, icons
├── App.tsx                    # App entry point
├── app.json                   # Expo configuration
├── DEEP_LINKING_SETUP.md     # Deep linking guide
└── package.json
```

---

## 🔧 Development

### Available Scripts

```bash
npm start              # Start development server
npm run ios            # Run on iOS
npm run android        # Run on Android
npm run web            # Run on web
npm run type-check     # TypeScript checking
npm run lint           # ESLint
npm run format         # Prettier
npm test               # Run tests
```

### Mock Data

The app includes realistic mock data for development:

- **13 Australian venues** (The Baxter Inn, The Glenmore Hotel, Frankie's Pizza, etc.)
- **3 sample events** (Pub Trivia, Live Acoustic, Rooftop DJ)
- **Mock user profiles** with preferences
- **Sample reviews** and ratings
- **Mock analytics data** for venue owners

Replace with real data by connecting to Firebase backend.

---

## 📈 Development Status

### ✅ Completed (Phases 1-8)

- [x] Phase 1: Authentication & Onboarding (100%)
- [x] Phase 2: Discovery & Search (100%)
- [x] Phase 3: Personalization & Favorites (100%)
- [x] Phase 4: Events & Notifications (100%)
- [x] Phase 5: Profile & Account (100%)
- [x] Phase 6: Payments & Rewards (100%)
- [x] Phase 7: Reviews & Social (100%)
- [x] Phase 8: Advanced Features (100%)
  - [x] Advanced search filters & sorting
  - [x] Saved searches
  - [x] Dark mode theme
  - [x] Venue owner dashboard
  - [x] Activity history
  - [x] Photo uploads
  - [x] Deep linking

### 🎯 Production Readiness Checklist

- [ ] Connect to production Firebase project
- [ ] Configure environment variables
- [ ] Set up Firebase Cloud Functions
- [ ] Implement real payment processing (Stripe)
- [ ] Configure push notifications
- [ ] Set up analytics (Firebase Analytics, Mixpanel)
- [ ] Implement crash reporting (Sentry)
- [ ] Add end-to-end tests
- [ ] Performance optimization
- [ ] Security audit
- [ ] App Store submission preparation
- [ ] Configure deep linking domains

---

## 🎨 Design System

### Brand Colors

```typescript
orange: '#FFB700'      // Primary actions
darkGreen: '#1F4D36'   // Secondary
cream: '#FFF8E1'       // Backgrounds
charcoal: '#1A1A1A'    // Text (light mode)
lightText: '#E1E1E1'   // Text (dark mode)
```

### Components

All components follow Material Design 3 with custom PubMate branding.

---

## 📄 License

Proprietary - © 2025 Vivacity Digital

All rights reserved.

---

## 📞 Support

**Email:** support@vivacitydigital.com.au
**Developer:** Bryson Walter
**Organization:** Vivacity Digital

---

<div align="center">

**Built with ❤️ in Australia**

🍺 Cheers! 🍺

</div>
