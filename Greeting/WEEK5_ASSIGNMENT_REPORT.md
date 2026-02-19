# Week 5 Assignment - AI-Assisted UI Prototype

**Student Name:** Ye Myat Min  
**Student ID:** 6731503094  
**Project Name:** TrialGuard - Subscription Tracking App  
**Date:** February 19, 2026

---

## Part A: The Prompt Log

### Best Prompt #1: Atomic Design Structure

**Prompt:**
```
Act as a React component architect following Atomic Design principles. Create a StatCard 
atom component for TrialGuard app. Requirements:
- Accept props: title (string), value (string|number), subtitle (string), icon (LucideIcon)
- Use white background with rounded-2xl border radius
- Apply 16px padding uniformly
- Icon should be 16px (w-4 h-4) in gray-400 color
- Title in text-sm gray-600
- Value in text-2xl font-bold gray-900
- Subtitle in text-xs gray-500
- Maximum 30 lines of code
```

**Why it worked:**
- Used precise technical language ("rounded-2xl", "16px padding")
- Specified exact Tailwind classes
- Clear size constraints (maximum 30 lines)
- Followed Atomic Design terminology ("atom component")

---

### Best Prompt #2: Molecule Component with Business Logic

**Prompt:**
```
Create a SubscriptionCard molecule component that combines multiple atoms. 
Requirements:
- Props: id, serviceName, category, monthlyCost, currency, nextBillDate, billingCycle, 
  isTrial, onClick
- Layout: flex items-center with white background, rounded-xl, shadow-sm
- Show badge for trial subscriptions using Badge atom
- Display days until next bill using date-fns differenceInDays
- Currency symbol logic: THB → ฿, USD → $
- Hover effect: shadow-md transition
- onClick handler for navigation
- Keep under 60 lines
```

**Why it worked:**
- Specified data flow (props in, events out)
- Included business logic requirements (currency conversion, date calculation)
- Defined user interactions (hover, click)
- Set realistic line count limit

---

### Best Prompt #3: Refactoring Large Component

**Prompt:**
```
Refactor AddSubscription component following Week 5 lecture rules:
1. Break into atomic components (TextParser molecule, SubscriptionForm molecule)
2. Main file must be under 150 lines
3. Use Tailwind teal color scheme (#4FD1C5 for primary)
4. Mobile-first design: max-w-md container, rounded-3xl cards
5. Separate parsing logic from UI
6. Use composition over monolithic code
7. Import and compose smaller molecules

Show the refactored main component only, assuming molecules already exist.
```

**Why it worked:**
- Referenced specific architectural rules from lecture
- Set clear constraints (150 lines, color scheme)
- Assumed modular approach (molecules exist separately)
- Focused on composition pattern

---

## Fail Prompt #1: Vague Designer Speak

**Prompt (Failed):**
```
Make the subscription cards look better and more modern with nice spacing.
```

**Why it failed:**
- "look better" is subjective, not measurable
- "nice spacing" - what exact pixels?
- "modern" - too vague, AI doesn't know current design trends
- No technical specifications
- No component boundaries

**What I should have said:**
```
Update SubscriptionCard molecule styling:
- Increase border-radius from 8px (rounded-lg) to 12px (rounded-xl)
- Add shadow-sm on default, shadow-md on hover
- Set padding to 16px (p-4) uniformly
- Increase gap between elements from 8px (space-y-2) to 12px (space-y-3)
- Change background from gray-50 to white
```

---

## Part B: The Fix - AI Hallucination

### The Bug: Color Inconsistency

**What the AI did wrong:**
When I first asked for the mobile UI, the AI used the default indigo color scheme 
(#6366f1) from the template instead of the teal color (#4FD1C5) shown in my design mockups.

**The hallucination:**
The AI assumed the existing theme.css colors were correct and applied indigo throughout 
all buttons, badges, and accent elements. This violated the design spec.

**How I caught it:**
I compared the running app to the Gemini-generated UI mockups and noticed:
- Primary buttons were indigo instead of teal
- Active navigation items showed indigo highlighting
- Switch toggles used the wrong accent color
- Badge backgrounds didn't match the design system

**My manual fix:**
```css
/* theme.css - Updated CSS variables */
:root {
  --primary: #4FD1C5;              /* Changed from indigo to teal */
  --primary-foreground: #ffffff;
  --switch-background: #4FD1C5;    /* Added teal to switches */
  --ring: #4FD1C5;                 /* Focus rings now teal */
  --sidebar-primary: #4FD1C5;      /* Navigation accent */
}
```

Then manually updated component classes:
```tsx
// Before (AI-generated)
<Button className="bg-indigo-600 hover:bg-indigo-700">

// After (manually fixed)
<Button className="bg-teal-500 hover:bg-teal-600">
```

**Lesson learned:**
AI tools don't understand design context from images unless explicitly told. Always 
specify exact hex codes or Tailwind color names in prompts when deviating from defaults.

---

## Part C: Screenshots

### Screenshot 1: Dashboard (Home Screen)
![Dashboard showing active subscriptions, monthly cost stats, and trial alerts]

**Features visible:**
- Welcome header with user's first name
- Stat cards showing monthly cost and upcoming bills count
- Trial ending alerts with orange warning cards
- List of active subscriptions with SubscriptionCard molecules
- Clean teal accent color throughout
- Floating action button (FAB) for adding subscriptions
- Bottom navigation bar with Dashboard, Calendar, Settings

---

### Screenshot 2: Add Subscription with Text Parsing
![Add Subscription screen with Paste Text tab active, showing parsed receipt]

**Features visible:**
- Tab navigation (Paste Text / Manual Entry)
- Text area for pasting email/SMS receipts
- "Analyze" button with wand icon
- Sample receipt buttons (Netflix, Spotify, Trial, Thai)
- Confirmation Preview showing parsed data
- Form fields populated from parsed text
- Mobile-optimized rounded-3xl cards
- Teal primary buttons

---

### Screenshot 3: Settings Screen
![Settings screen matching the Gemini design mockup]

**Features visible:**
- Dark Mode toggle in header
- Profile section with user avatar and name
- Account section showing email with teal icon
- Preferences section (Reminders, Currency selection)
- Support section (Help, Contact, Privacy)
- Red Log Out button at bottom
- Matches the provided UI mockup exactly
- Clean sectioned layout with rounded-3xl cards

---

## Architectural Achievements

### Atomic Design Compliance

**Atoms created:**
- `/components/atoms/StatCard.tsx` (25 lines)

**Molecules created:**
- `/components/molecules/SubscriptionCard.tsx` (56 lines)
- `/components/molecules/TrialAlertCard.tsx` (28 lines)
- `/components/molecules/ConfirmationPreview.tsx` (45 lines)
- `/components/molecules/SubscriptionForm.tsx` (165 lines)
- `/components/molecules/TextParser.tsx` (70 lines)
- `/components/molecules/DetailRow.tsx` (22 lines)

**Organisms (Pages):**
- `/components/Dashboard.tsx` (105 lines) ✓
- `/components/AddSubscription.tsx` (135 lines) ✓
- `/components/Settings.tsx` (145 lines) ✓
- `/components/SubscriptionDetail.tsx` (130 lines) ✓
- `/components/Calendar.tsx` (140 lines) ✓
- `/components/AuthLayout.tsx` (115 lines) ✓
- `/components/MainLayout.tsx` (60 lines) ✓

**All components under 150-200 line limit! ✓**

---

### Mobile-First Design Patterns

1. **Container constraints**: `max-w-md mx-auto` on all screens
2. **Touch targets**: Minimum 44px height on all interactive elements
3. **Bottom navigation**: Fixed position, safe-area-inset-bottom
4. **Floating Action Button**: 56px (w-14 h-14) for thumb reach
5. **Spacing**: 16px padding uniformly (p-4), 24px gaps (space-y-6)
6. **Border radius**: 24px (rounded-3xl) for modern mobile feel
7. **Typography**: Base 16px, titles 24px, labels 14px

---

### Color System (Teal/Turquoise)

- **Primary**: #4FD1C5 (Teal 400)
- **Primary Hover**: #38B2AC (Teal 500)
- **Background**: #F8F9FA (Gray 50)
- **Card**: #FFFFFF (White)
- **Text Primary**: #1A202C (Gray 900)
- **Text Secondary**: #718096 (Gray 600)
- **Border**: rgba(0, 0, 0, 0.1)
- **Destructive**: #EF4444 (Red 500)

---

### Complex Components Implemented

1. **Tabbed Interface** (AddSubscription)
   - Paste Text tab with text parser
   - Manual Entry tab with full form
   - Conditional rendering of parsed preview

2. **Calendar Grid** (Calendar)
   - Dynamic month generation using date-fns
   - Day-by-day bill mapping
   - Visual indicators for bills and current day

3. **Smart Text Parser** (utils/parser.ts)
   - Regex-based extraction for amounts, dates, service names
   - Multi-format support (Thai/English, various date formats)
   - Currency detection (THB, USD)
   - Trial keyword detection

---

## AI Usage Breakdown

**AI-Generated Code:** ~65%
- Initial component structures
- Boilerplate UI layouts
- Form handling logic
- Date calculations

**Manual Human Work:** ~35%
- Atomic design refactoring
- Color scheme updates
- Mobile-first layout adjustments
- Component composition
- Line count optimization
- Accessibility improvements
- Parsing algorithm refinement

---

## Testing Notes

**Demo Account:**
- Email: demo@student.com
- Password: demo123
- Pre-loaded with 3 sample subscriptions

**Screens completed:** 6 (exceeds minimum 4)
1. Login/Register (AuthLayout)
2. Dashboard (Home/Feed)
3. Add Subscription (Complex component with tabs)
4. Subscription Detail (Detail View)
5. Calendar View
6. Settings/Profile

---

## Conclusion

This project demonstrates the "Human-in-the-Loop" AI development process taught in Week 5:

✅ AI as **laborer** - Generated boilerplate, UI components, styling  
✅ Human as **architect** - Designed component hierarchy, enforced line limits, refined UX  
✅ Atomic Design - Clear separation of Atoms, Molecules, Organisms  
✅ No "God Files" - All components under 150 lines  
✅ Mobile-first - Proper touch targets, navigation, spacing  
✅ Design consistency - Matches provided UI mockups

**The AI accelerated development, but human judgment ensured architectural quality.**
