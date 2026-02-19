# Icon Guide for TrialGuard

## Current Setup (Emoji Icons)
Currently using simple emoji icons like 🎬, 🎵, 🏰, etc. These work but are limited.

## Better Icon Options for React Native

### 1. **@expo/vector-icons** (Recommended - Already Included!)
Expo projects come with this pre-installed. Includes multiple icon sets:
- **Ionicons** - Modern, clean icons (most popular)
- **MaterialIcons** - Google Material Design
- **FontAwesome** - Huge variety
- **MaterialCommunityIcons** - Extra Material icons

**Installation:** Already included with Expo!

**Usage Example:**
```tsx
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// In your component:
<Ionicons name="logo-netflix" size={24} color="#E50914" />
<MaterialCommunityIcons name="spotify" size={24} color="#1DB954" />
<Ionicons name="logo-youtube" size={24} color="#FF0000" />
```

**Icon Names:**
- Netflix: `logo-netflix`
- Spotify: `logo-spotify` (MaterialCommunityIcons)
- YouTube: `logo-youtube`
- Disney+: `castle` or custom
- Settings: `settings` or `cog`
- Calendar: `calendar` or `calendar-outline`
- Home: `home` or `home-outline`
- Add: `add-circle` or `add-circle-outline`

**Browse Icons:** https://icons.expo.fyi/

### 2. **react-native-vector-icons** (Alternative)
Similar to Expo icons but with more configuration.

**Installation:**
```bash
npm install react-native-vector-icons
```

### 3. **Custom SVG Icons** with react-native-svg
For brand logos and custom designs.

**Installation:**
```bash
npx expo install react-native-svg
```

## Recommended Next Steps

### For Navigation Icons:
Replace emoji in `NewAppNavigator.tsx`:
```tsx
import { Ionicons } from '@expo/vector-icons';

const tabs = [
  { name: 'Dashboard', icon: 'home', route: 'Dashboard' },
  { name: 'Calendar', icon: 'calendar', route: 'Calendar' },
  { name: 'Settings', icon: 'settings', route: 'Settings' },
];

// Then render:
<Ionicons name={tab.icon} size={24} color={isFocused ? '#4FD1C5' : '#9CA3AF'} />
```

### For Subscription Icons:
Update `mockData.ts` with icon library names:
```tsx
{
  serviceName: 'Netflix',
  iconLibrary: 'Ionicons',
  iconName: 'logo-netflix',
  iconColor: '#E50914',
  // ...
}
```

### Service Brand Colors:
- Netflix: `#E50914`
- Spotify: `#1DB954`
- YouTube: `#FF0000`
- Disney+: `#113CCF`
- Adobe: `#FF0000`
- Notion: `#000000`

## Quick Implementation

1. Import icons in SubscriptionCard.tsx:
```tsx
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
```

2. Replace emoji with vector icons
3. Use brand colors for better look

**No installation needed** - Expo already includes @expo/vector-icons!
