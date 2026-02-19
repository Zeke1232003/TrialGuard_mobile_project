# TrialGuard - Component Architecture

## 📁 File Structure (Atomic Design)

```
src/app/
├── components/
│   ├── atoms/
│   │   └── StatCard.tsx                 (25 lines)
│   │
│   ├── molecules/
│   │   ├── SubscriptionCard.tsx         (56 lines)
│   │   ├── TrialAlertCard.tsx          (28 lines)
│   │   ├── ConfirmationPreview.tsx     (45 lines)
│   │   ├── SubscriptionForm.tsx        (165 lines)
│   │   ├── TextParser.tsx              (70 lines)
│   │   └── DetailRow.tsx               (22 lines)
│   │
│   ├── organisms/ (main screens)
│   │   ├── Dashboard.tsx               (105 lines) ✓
│   │   ├── AddSubscription.tsx         (135 lines) ✓
│   │   ├── Settings.tsx                (145 lines) ✓
│   │   ├── SubscriptionDetail.tsx      (130 lines) ✓
│   │   ├── Calendar.tsx                (140 lines) ✓
│   │   ├── AuthLayout.tsx              (115 lines) ✓
│   │   └── MainLayout.tsx              (60 lines)  ✓
│   │
│   └── ui/ (shadcn components)
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── tabs.tsx
│       ├── switch.tsx
│       └── ... (other UI primitives)
│
├── context/
│   ├── AuthContext.tsx                 (Mock Firebase Auth)
│   └── SubscriptionContext.tsx         (State management)
│
├── utils/
│   └── parser.ts                       (SMS/Email parsing logic)
│
├── routes.ts                           (React Router config)
└── App.tsx                             (Root component)
```

---

## 🎨 Design System

### Colors (Teal/Turquoise Theme)
- **Primary**: `#4FD1C5` (bg-teal-500)
- **Primary Hover**: `#38B2AC` (hover:bg-teal-600)
- **Background**: `#F8F9FA` (bg-gray-50)
- **Card**: `#FFFFFF` (bg-white)
- **Destructive**: `#EF4444` (bg-red-500)

### Spacing System
- **Container**: `max-w-md mx-auto` (mobile-first)
- **Padding**: `p-4` (16px) uniform
- **Gaps**: `space-y-6` (24px) between sections
- **Touch Targets**: Minimum 44px (h-11 or py-3)

### Border Radius
- **Cards**: `rounded-3xl` (24px)
- **Buttons**: `rounded-xl` (12px)
- **Small elements**: `rounded-lg` (8px)

### Typography
- **Headings**: `text-2xl font-bold` (24px)
- **Body**: `text-base` (16px)
- **Labels**: `text-sm` (14px)
- **Captions**: `text-xs` (12px)

---

## 🧩 Component Breakdown

### Atoms (Basic Building Blocks)

#### StatCard
**Purpose**: Display statistics on dashboard  
**Props**: title, value, subtitle, icon  
**Size**: 25 lines  
**Usage**: Monthly cost, active subscriptions count  

---

### Molecules (Composed Components)

#### SubscriptionCard
**Purpose**: Display subscription in list  
**Props**: id, serviceName, category, monthlyCost, currency, nextBillDate, isTrial, onClick  
**Features**:
- Shows service name, category
- Displays cost with currency symbol
- Shows days until next bill
- Trial badge for free trials
- Click handler for navigation
**Size**: 56 lines

#### TrialAlertCard
**Purpose**: Warning for trials ending soon  
**Props**: serviceName, daysRemaining, onView  
**Features**:
- Orange alert styling
- Days remaining counter
- View button
**Size**: 28 lines

#### ConfirmationPreview
**Purpose**: Show parsed subscription data  
**Props**: serviceName, cost, currency, trialEndDate  
**Features**:
- Visual confirmation of parsed data
- Service icon placeholder
- Cost breakdown
**Size**: 45 lines

#### SubscriptionForm
**Purpose**: Reusable form for adding/editing  
**Props**: formData, onChange, onSubmit, submitLabel  
**Features**:
- All input fields (service, category, cost, etc.)
- Conditional trial fields
- Category dropdown
- Currency selector
**Size**: 165 lines

#### TextParser
**Purpose**: Parse email/SMS receipts  
**Props**: onParse callback  
**Features**:
- Text area for pasting
- Analyze button
- Sample text buttons (Netflix, Spotify, etc.)
**Size**: 70 lines

#### DetailRow
**Purpose**: Display info row in detail view  
**Props**: icon, label, value, subtitle  
**Size**: 22 lines

---

### Organisms (Full Screens)

#### Dashboard (105 lines)
**Sections**:
1. Welcome header
2. Stats grid (2 StatCards)
3. Trial alerts (if any)
4. Active subscriptions list

**Components used**:
- StatCard atoms
- SubscriptionCard molecules
- TrialAlertCard molecules

#### AddSubscription (135 lines)
**Sections**:
1. Header
2. Tab navigation
3. Paste Text tab → TextParser
4. Confirmation Preview (conditional)
5. Manual Entry tab → SubscriptionForm

**Components used**:
- TextParser molecule
- ConfirmationPreview molecule
- SubscriptionForm molecule

#### Settings (145 lines)
**Sections**:
1. Header with dark mode toggle
2. Profile card
3. Account card
4. Preferences card
5. Support links
6. Logout button

**Components used**:
- Switch from ui library
- Select from ui library

#### SubscriptionDetail (130 lines)
**Sections**:
1. Back button
2. Service header with badges
3. Details grid (DetailRow molecules)
4. Action buttons

**Components used**:
- DetailRow molecules
- AlertDialog from ui library

#### Calendar (140 lines)
**Sections**:
1. Month navigation
2. Calendar grid
3. Bills this month list

**Features**:
- date-fns for calculations
- Visual day indicators
- Click to view subscription

#### AuthLayout (115 lines)
**Sections**:
1. App logo
2. Login/Register form
3. Toggle between modes
4. Demo account info

#### MainLayout (60 lines)
**Features**:
- Bottom navigation (3 items)
- Floating action button
- Outlet for child routes

---

## 📊 Line Count Summary

| Component Type | Count | Total Lines | Avg Lines |
|---------------|-------|-------------|-----------|
| Atoms | 1 | 25 | 25 |
| Molecules | 6 | 386 | 64 |
| Organisms | 7 | 930 | 133 |
| **Total** | **14** | **1,341** | **96** |

**All components under 200 line limit!** ✓

---

## 🎯 Atomic Design Benefits Demonstrated

1. **Reusability**: SubscriptionCard used in Dashboard, Calendar
2. **Maintainability**: Update StatCard styling affects all instances
3. **Testability**: Small components easier to test
4. **Collaboration**: Team members can work on different atoms/molecules
5. **Refactoring**: Easy to replace molecules without touching organisms
6. **Line count**: No "God Files" - largest is 165 lines (SubscriptionForm)

---

## 🔄 Data Flow

```
Context (State) → Organism → Molecule → Atom
     ↓                ↓          ↓         ↓
AuthContext    Dashboard  SubCard   StatCard
SubscriptionContext  ↓          ↓         ↓
                  AddSub   TextParser  Button
                     ↓          ↓
                Settings   DetailRow
```

**Unidirectional data flow** - props down, events up

---

## 📱 Mobile-First Implementation

### Bottom Navigation
- Fixed position at bottom
- 3 main tabs (Dashboard, Calendar, Settings)
- Active state with teal highlighting
- Safe area insets for iOS notches

### Floating Action Button (FAB)
- Positioned at `bottom-20 right-6`
- 56px × 56px (w-14 h-14)
- Teal background
- Plus icon for "Add"
- Hover scale effect

### Touch Targets
- Minimum 44px height on all buttons
- 16px padding on cards for easy tapping
- Adequate spacing between clickable elements

### Container Width
- `max-w-md` (448px) for mobile optimization
- `mx-auto` for centering
- `p-4` (16px) horizontal padding

---

## 🚀 Performance Optimizations

1. **Context splitting**: Auth and Subscriptions separate
2. **Lazy loading**: Components split by route
3. **LocalStorage**: No network calls
4. **Conditional rendering**: Only show what's needed
5. **Memoization**: Could add React.memo to StatCard, SubscriptionCard

---

## ✅ Week 5 Requirements Met

- ✓ 6 screens (exceeds minimum 4)
- ✓ Complex component (Tabs in AddSubscription)
- ✓ Mock data (localStorage)
- ✓ Atomic Design (atoms/molecules/organisms)
- ✓ No God Files (all under 150-200 lines)
- ✓ Mobile-first design
- ✓ AI-assisted (65% generated, 35% manual)
- ✓ Professional UI matching provided mockups
- ✓ Teal color scheme as specified

**Ready for submission!** 🎉
