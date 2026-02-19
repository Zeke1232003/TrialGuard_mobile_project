# Week 5 Assignment Documentation - TrialGuard Mobile App

**Student Name:** Ye Myat Min  
**Student ID:** (Your ID)  
**Project Name:** TrialGuard - Subscription Management App  
**Date:** February 19, 2026

---

## 📱 Project Overview

A React Native mobile application for tracking subscriptions and free trials, built using AI-assisted development with 70%+ AI-generated code.

### Completed Screens (7 total):
1. ✅ **LoginScreen** - Authentication with demo credentials
2. ✅ **RegisterScreen** - Account creation
3. ✅ **DashboardScreen** - Home with stats cards, trial alerts, subscription list (**Complex Component C**)
4. ✅ **AddSubscriptionScreen** - Tabbed interface with text parsing (**Complex Component A**)
5. ✅ **SubscriptionDetailScreen** - Detailed view with cost breakdown
6. ✅ **CalendarScreen** - Interactive calendar with bills (**Complex Component B**)
7. ✅ **SettingsScreen** - User preferences and profile

### Complex Components:
- **Component A:** Tabbed Add Subscription with Parse/Manual entry modes
- **Component B:** Interactive Calendar with date-based bill visualization
- **Component C:** Dashboard with StatCards, TrialAlertCards, and scrollable subscription list

---

## 🎯 AI Prompts Used

### PROMPT #1: Setup Project Structure
**What I Asked:**
> "Act as a React Native architect. Create a professional folder structure inside `src/components/` following atomic design principles. I need folders for: `ui/` (base components), `atoms/` (small reusable components), `molecules/` (complex reusable components), and `screens/` (all app screens). This is for a subscription tracking app."

**Result:** Created organized folder structure:
```
src/components/
  ├── ui/              # Button, Input, Card, Badge
  ├── atoms/           # StatCard
  ├── molecules/       # SubscriptionCard, TrialAlertCard
  ├── screens/         # All 7 screens
  └── navigation/      # NewAppNavigator
```

### PROMPT #2: Build Atomic Components
**What I Asked:**
> "Create a `StatCard` atom component in React Native for a subscription app dashboard. It should display: an icon (from a library), a title, a large value (like $150 or 5), and a subtitle. Use a white background card with rounded corners (rounded-2xl), and arrange items using flexbox. Style it with NativeWind/Tailwind classes matching this design: teal primary color (#4FD1C5), gray text for labels, and black bold text for values."

**Result:** Created reusable StatCard showing monthly cost and upcoming bills

### PROMPT #3: Build Authentication Screens
**What I Asked:**
> "Create a mobile-first LoginScreen in React Native for a subscription tracking app called 'TrialGuard'. Requirements: gradient background (teal-50 to cyan-100), centered card with white background and rounded-3xl corners, app logo (use a Shield icon from a library), email and password inputs, login button in teal (#4FD1C5), toggle to switch to register mode, and include demo credentials (demo@student.com / demo123) displayed in a small info box. Use a professional, modern design with proper spacing."

**Result:** Beautiful auth screens with proper UX and demo credentials

### FAILED PROMPT (Learning Experience):
**What I Asked (Initially):**
> "Make me a full dashboard screen with everything"

**Why It Failed:**
- Too vague and non-specific
- Didn't specify components, layout, or data structure
- AI couldn't understand requirements
- Generated messy, non-reusable code

**How I Fixed It:**
- Broke down into smaller parts (StatCard first, then SubscriptionCard, then assembly)
- Specified exact layout and styling requirements
- Used atomic design approach
- Result: Clean, maintainable, reusable components

---

## 🐛 Bug/Hallucination Found and Fixed

### The Bug: Text Input Not Showing Placeholder in AddSubscription Form

**What the AI Generated (Bug):**
In `AddSubscriptionScreen.tsx`, the multiline TextInput for pasting receipts didn't show the placeholder text clearly:

```tsx
<TextInput
  className="w-full h-32 p-3 bg-gray-50 border border-gray-200 rounded-xl text-base text-gray-900"
  placeholder="Paste email or SMS receipt here..."
  multiline
  textAlignVertical="top"
  value={pastedText}
  onChangeText={setPastedText}
/>
```

**The Problem:**
- Missing `placeholderTextColor` prop
- On some devices, placeholder was invisible (white text on white background)
- Common React Native issue that AI forgot

**My Manual Fix:**
```tsx
<TextInput
  className="w-full h-32 p-3 bg-gray-50 border border-gray-200 rounded-xl text-base text-gray-900"
  placeholder="Paste email or SMS receipt here..."
  placeholderTextColor="#9CA3AF"  // ← ADDED THIS
  multiline
  textAlignVertical="top"
  value={pastedText}
  onChangeText={setPastedText}
/>
```

**Lesson Learned:**
- AI sometimes forgets platform-specific properties
- Always test on actual device/emulator
- React Native docs are essential alongside AI tools

---

## 📊 File Structure Created

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx          # Reusable button with variants
│   │   ├── Input.tsx           # Form input with label & error
│   │   ├── Card.tsx            # White rounded card container
│   │   ├── Badge.tsx           # Small colored badges
│   │   └── index.ts
│   ├── atoms/
│   │   ├── StatCard.tsx        # Dashboard statistics card
│   │   └── index.ts
│   ├── molecules/
│   │   ├── SubscriptionCard.tsx    # Subscription list item
│   │   ├── TrialAlertCard.tsx      # Trial warning card
│   │   └── index.ts
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── AddSubscriptionScreen.tsx
│   │   ├── SubscriptionDetailScreen.tsx
│   │   ├── CalendarScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   └── index.ts
│   └── navigation/
│       └── NewAppNavigator.tsx
└── data/
    └── mockData.ts             # Mock subscriptions & user
```

---

## 🎨 Design System

### Colors
- **Primary:** #4FD1C5 (Teal)
- **Background:** #f8f9fa (Light gray)
- **Card:** #ffffff (White)
- **Text:** Gray-900, Gray-600, Gray-500
- **Alert:** Orange for trials, Red for errors

### Typography
- **Headers:** Bold, 2xl/xl/lg sizes
- **Body:** Medium weight, base size
- **Labels:** Small, gray-600

### Components
- **Border Radius:** rounded-xl (12px), rounded-2xl (16px), rounded-3xl (24px)
- **Spacing:** Consistent 4-unit grid (4px, 8px, 12px, 16px, 24px)
- **Shadows:** shadow-sm, shadow-lg

---

## 🚀 How to Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start Metro:
   ```bash
   npm start
   ```

3. Run on platform:
   - Press `a` for Android
   - Press `i` for iOS
   - Scan QR for physical device

4. Login with demo account:
   - Email: demo@student.com
   - Password: demo123

---

## ✅ Requirements Checklist

- [x] **4+ Screens:** 7 screens created
- [x] **Complex Components:** 3 complex components (A, B, C)
- [x] **Mock Data:** mockData.ts with 6 subscriptions
- [x] **AI-Generated:** 70%+ of code from AI prompts
- [x] **Clean Code:** Atomic design, no files >200 lines
- [x] **Professional UI:** Consistent design, rounded corners, proper spacing
- [x] **Documentation:** This file + prompt logs

---

## 📝 Manual Work Done (The "Human" Part)

1. **Architecture Decisions:**
   - Chose atomic design pattern
   - Organized into ui/atoms/molecules/screens
   - Decided on teal primary color

2. **Code Refinement:**
   - Split large files into smaller components
   - Added proper TypeScript types
   - Fixed placeholder color issue
   - Standardized spacing (4px grid)

3. **UX Improvements:**
   - Added loading states to buttons
   - Improved form validation
   - Added demo credentials display
   - Made calendar interactive

4. **Testing & Debugging:**
   - Fixed navigation issues
   - Tested on multiple screen sizes
   - Ensured proper keyboard handling
   - Added proper alerts/confirmations

---

## 📸 Screenshots

[Take 3-4 screenshots of your running app:]
1. LoginScreen with demo credentials
2. DashboardScreen showing stats and subscriptions
3. Add SubscriptionScreen with tabs
4. CalendarScreen with bills

---

## 🎓 Reflection

### What Worked Well:
- Atomic design made components highly reusable
- AI was excellent at generating boilerplate UI code
- Breaking down into small prompts gave better results
- NativeWind/Tailwind classes made styling fast

### Challenges:
- AI sometimes forgot React Native-specific props
- Had to manually integrate navigation
- Needed to standardize spacing manually
- AI-generated forms lacked proper validation

### Key Takeaway:
**I am the architect, AI is the laborer.** I made all high-level decisions (structure, colors, component hierarchy) and used AI to speed up implementation. The result is a professional app that I could explain and extend independently.

---

**Total Development Time:** ~3-4 hours  
**AI Contribution:** ~70% (code generation)  
**Human Contribution:** ~30% (architecture, refinement, debugging)
