# TrialGuard - Quick Start Guide

## 🚀 Getting Started

### Demo Account
The easiest way to try the app:

```
Email: demo@student.com
Password: demo123
```

The demo account comes with 3 pre-loaded subscriptions:
- Netflix (299 THB/month)
- Spotify Premium (129 THB/month)  
- Disney+ (9.99 USD/month - Free Trial ending soon!)

---

## 📱 App Tour

### 1. Dashboard Screen
**What you'll see:**
- Welcome message with your name
- Two stat cards showing:
  - Total monthly cost
  - Number of upcoming bills
- Orange alert cards for trials ending in next 7 days
- List of all active subscriptions

**Try this:**
- Tap any subscription card to view details
- Check the trial alert for Disney+

---

### 2. Add Subscription (via FAB)
**Two ways to add:**

#### Method A: Paste & Parse (Recommended)
1. Tap the green **+** button (bottom right)
2. Stay on "Paste Text" tab
3. Tap one of the sample buttons (Netflix, Spotify, etc.)
4. Tap **"Analyze"** button
5. Review the parsed data in "Confirmation Preview"
6. Edit any fields if needed
7. Tap **"Save"**

#### Method B: Manual Entry
1. Tap the green **+** button
2. Switch to "Manual Entry" tab
3. Fill in:
   - Service Name (required)
   - Category (dropdown)
   - Amount (required)
   - Currency (THB or USD)
   - Billing Cycle (Weekly/Monthly/Yearly)
   - Next Bill Date (required)
   - Toggle "This is a free trial" if applicable
4. Tap **"Add Subscription"**

---

### 3. Subscription Detail
**What you'll see:**
- Service name and cost (large)
- Status badge (Active/Cancelled)
- Trial badge (if applicable)
- Category, next bill date, yearly estimate
- Cancel/Reactivate button
- Delete button (with confirmation)

**Try this:**
1. From Dashboard, tap "Disney+"
2. See the trial information
3. Try the "Cancel" button
4. Go back and see it marked as cancelled

---

### 4. Calendar View
**What you'll see:**
- Current month calendar
- Days with bills are highlighted in teal
- Amount shown under each day
- List of bills below calendar, grouped by date

**Try this:**
- Navigate to different months using arrows
- See when your subscriptions renew
- Tap any subscription in the list to view details

---

### 5. Settings
**What you can do:**
- Toggle Dark Mode (coming soon!)
- View your profile and email
- Enable/disable notification reminders
- Change currency preference (THB ↔ USD)
- Access support links
- Log out

**Try this:**
1. Change currency from THB to USD
2. Go back to Dashboard
3. See all amounts now showing in dollars
4. Change it back to THB

---

## 🧪 Testing the Parser

### Sample Receipts Included

1. **Netflix** - Standard monthly subscription
2. **Spotify** - Thai baht format
3. **Disney+ Trial** - Free trial with USD pricing
4. **AIS Play** - Thai language receipt

### What Gets Extracted
✓ Service name  
✓ Amount and currency  
✓ Billing date  
✓ Trial status  

### Supported Formats

**Amounts:**
- `299 THB` or `THB 299`
- `฿299` or `299 บาท`
- `$9.99` or `USD 9.99`

**Dates:**
- ISO: `2026-02-28`
- Slash: `28/02/2026` or `02/28/2026`
- English: `Feb 28, 2026` or `February 28, 2026`
- Thai: `28 ก.พ. 2569` or `28 กุมภาพันธ์ 2569`

**Trial Keywords:**
- "trial", "free trial", "trial period"
- "ทดลอง", "ทดลองใช้ฟรี", "ฟรี"

---

## 🎨 Design Features

### Mobile-First
- Optimized for phone screens (max 448px wide)
- Bottom navigation for thumb reach
- Floating action button (FAB) for quick add
- Touch-friendly 44px minimum tap targets

### Teal Color Scheme
- Primary: #4FD1C5 (Teal 500)
- Buttons, badges, and accents use teal
- Matches the provided UI mockups

### Clean Layout
- 24px rounded corners on cards
- 16px consistent padding
- Ample white space
- Clear visual hierarchy

---

## 🔔 Notifications

### How to Enable
1. Go to Settings
2. Toggle "Reminders Enabled"
3. Allow notifications when prompted
4. You'll get alerts 3 days before bills

**Note:** Browser notifications only work when the app is open.

---

## 💾 Data Storage

### Local Only
- All data stored in browser's localStorage
- No backend server
- No data sent over internet
- Data persists until you clear browser data

### Per-User Storage
- Each account has separate data
- Demo account data is pre-loaded
- Your test accounts will have empty data initially

---

## 🐛 Troubleshooting

### "Subscription not found"
- You may have deleted it
- Try going back to Dashboard

### Parser didn't extract data
- Text format may be too complex
- Use "Manual Entry" tab instead
- Or try one of the sample receipts first

### Currency not changing
- Make sure you're in Settings
- Select the currency dropdown
- Go back to Dashboard to see changes

### Notifications not working
- Check browser notification settings
- Some browsers block notifications
- Try a different browser (Chrome recommended)

---

## 📊 Understanding Stats

### Monthly Cost
- Sum of all active subscriptions
- Yearly subscriptions divided by 12
- Weekly subscriptions multiplied by 4
- Displayed in your preferred currency

### Upcoming Bills
- Counts subscriptions due in next 30 days
- Sorted by date (soonest first)

### Trials Ending
- Shows trials ending in next 7 days
- Orange alert cards for visibility
- Don't forget to cancel if not needed!

---

## 🎓 Academic Notes

This is a **student project** created for:
- **Course:** Mobile Application Development
- **Assignment:** Week 5 - AI-Assisted UI Prototype
- **Focus:** Atomic Design, Mobile-First, Clean Architecture

**Educational Purposes Only**  
This app is a prototype/MVP for demonstration and learning.

---

## 📝 Quick Cheat Sheet

| Action | Navigation |
|--------|-----------|
| View Dashboard | Bottom nav → Home icon |
| Add Subscription | Tap green + button |
| View Details | Tap any subscription card |
| Check Calendar | Bottom nav → Calendar icon |
| Change Settings | Bottom nav → Settings icon |
| Try Text Parser | Add → Paste Text → Sample button |
| Log Out | Settings → Log Out (red button) |

---

## 🎉 Enjoy Testing!

Explore all features, try the parser with different formats, and see how the atomic design makes everything clean and maintainable!

**Creator:** Ye Myat Min (6731503094)  
**Date:** February 2026  
**License:** Educational Use Only
