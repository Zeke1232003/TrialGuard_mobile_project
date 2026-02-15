# TrialGuard - Subscription Management App

A React Native mobile application built with Expo to help university students manage and track their free trials and subscriptions.

## 🚀 Features

- **Authentication** - Login/Register with email or Google
- **Dashboard** - Overview of all subscriptions and upcoming bills
- **Smart Parsing** - Add subscriptions by pasting email/SMS receipts
- **Calendar View** - Visualize billing dates on a calendar
- **Reminders** - Get notified before trial periods end
- **Settings** - Manage account and app preferences

## 🛠 Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Zustand
- **Navigation**: React Navigation (Native Stack)
- **Backend**: Firebase (Auth & Firestore)
- **Architecture**: Feature-based folder structure

## 📁 Project Structure

```
src/
├── app/                # Navigation setup
│   ├── AppNavigator.tsx
│   ├── routes.ts
│   └── navigation.types.ts
├── core/               # Theme, constants, utilities
│   ├── theme.ts
│   ├── constants.ts
│   └── utils.ts
├── models/            # TypeScript interfaces
│   ├── User.ts
│   └── Subscription.ts
├── services/          # Firebase, parsing logic
│   ├── firebase.ts
│   └── parsing.ts
├── store/             # Zustand stores
│   ├── authStore.ts
│   └── subscriptionStore.ts
└── features/          # Feature-based organization
    ├── auth/
    │   └── screens/
    │       ├── LoginScreen.tsx
    │       └── RegisterScreen.tsx
    ├── dashboard/
    │   └── screens/
    │       └── HomeScreen.tsx
    ├── subscriptions/
    │   └── screens/
    │       ├── AddSubscriptionScreen.tsx
    │       └── SubscriptionDetailScreen.tsx
    ├── calendar/
    │   └── screens/
    │       └── CalendarScreen.tsx
    └── settings/
        └── screens/
            └── SettingsScreen.tsx
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI
- Firebase project (for backend)

### Installation

1. **Clone and setup**
   ```bash
   cd TrialGuard
   npm install
   ```

2. **Configure Firebase**
   - Update `src/services/firebase.ts` with your Firebase configuration
   - Enable Authentication and Firestore in Firebase console

3. **Start development server**
   ```bash
   npm run start
   ```

4. **Run on device/simulator**
   - Install Expo Go app on your phone
   - Scan QR code from terminal
   - Or press 'i' for iOS simulator, 'a' for Android emulator

## 🎯 Current Status (Week 4)

✅ **Completed**:
- Project scaffold with feature-based architecture
- Navigation flow (Login → Home)
- All screen placeholders created
- Zustand store setup
- TypeScript configuration
- Theme and design system

🔄 **In Progress**:
- Firebase integration
- Subscription parsing logic
- UI component implementation

📋 **Next Steps**:
- Implement Firebase authentication
- Build subscription parsing service
- Add form validation
- Implement reminder notifications
- Polish UI components

## 🏗 Architecture Decisions

### Feature-Based Structure
- Files grouped by feature/domain rather than by type
- Each feature contains its own screens, components, hooks
- Promotes modularity and team collaboration

### State Management
- Zustand for lightweight global state
- Separate stores for auth and subscriptions
- Simple API, less boilerplate than Redux

### Navigation
- React Navigation with TypeScript
- Type-safe navigation props
- Conditional rendering based on auth state

### Styling
- Custom theme system with design tokens
- Consistent spacing, colors, typography
- Based on provided UI mockups

## 🎨 Design System

The app follows a clean, modern design with:
- **Primary Color**: #36D9B8 (Teal/Turquoise)
- **Typography**: System fonts with consistent sizing
- **Spacing**: 8px base unit system
- **Components**: Reusable UI elements

## 📱 Screens

1. **LoginScreen** - Email/Google authentication
2. **RegisterScreen** - Account creation
3. **HomeScreen** - Dashboard with subscription overview
4. **AddSubscriptionScreen** - Text parsing and manual entry
5. **SubscriptionDetailScreen** - Individual subscription management
6. **CalendarScreen** - Billing date visualization
7. **SettingsScreen** - User preferences and account

## 🔧 Development Commands

```bash
# Start development server
npm run start

# Run on iOS
npm run ios

# Run on Android  
npm run android

# Run on web
npm run web

# TypeScript check
npx tsc --noEmit
```

## 📝 Contributing

1. Follow feature-based folder structure
2. Use TypeScript for all new files
3. Maintain consistent code style
4. Add proper types for all props and functions
5. Update this README for significant changes

## 📄 License

This project is for educational purposes as part of a mobile app development course.