# TrialGuard - Subscription Tracking Application

## 📱 Overview

TrialGuard is a mobile-responsive web application designed to help budget-conscious students track recurring subscription payments and never forget to cancel free trials. 

**Created by:** Ye Myat Min (Student ID: 6731503094)  
**Project:** Mobile Application Development - Mini Project  
**Year:** 2026

## ✨ Key Features

### 1. **Smart Email/SMS Parsing**
- Paste subscription receipts directly into the app
- Automatically extracts:
  - Service name
  - Amount and currency
  - Billing date
  - Trial status
- Supports multiple formats (Thai and English)

### 2. **Dashboard Overview**
- Total monthly cost at a glance
- Active subscription count
- Upcoming bills (next 30 days)
- Trial ending alerts (next 7 days)
- Quick access to subscription details

### 3. **Subscription Management**
- Add subscriptions via parsing or manual entry
- View detailed subscription information
- Edit and update subscriptions
- Mark as cancelled or reactivate
- Delete subscriptions
- Cost breakdown calculator

### 4. **Calendar View**
- Visual monthly calendar
- See all bills at a glance
- Bills grouped by date
- Quick navigation between months

### 5. **Settings & Preferences**
- User profile management
- Currency preference (THB/USD)
- Notification settings
- Dark mode toggle (coming soon)

## 🚀 Getting Started

### Demo Account
Use these credentials to try the app immediately:

- **Email:** demo@student.com
- **Password:** demo123

The demo account comes pre-loaded with sample subscriptions including Netflix, Spotify, and Disney+ (with an active trial).

### Creating Your Own Account
1. Click "Sign up" on the login page
2. Enter your full name, email, and password
3. Start adding your subscriptions!

## 💡 How to Use

### Adding a Subscription

#### Method 1: Paste & Parse (Recommended)
1. Go to the "Add" tab
2. Copy a subscription receipt from your email or SMS
3. Paste it into the text area
4. Click "Parse Text"
5. Review and edit the extracted details
6. Click "Save Subscription"

Try the sample receipts provided to see how parsing works!

#### Method 2: Manual Entry
1. Go to the "Add" tab
2. Switch to "Manual Entry" tab
3. Fill in all the details:
   - Service name (required)
   - Category
   - Amount and currency (required)
   - Billing cycle
   - Next billing date (required)
   - Trial status (optional)
4. Click "Add Subscription"

### Managing Subscriptions
- **View Details:** Click on any subscription from the dashboard
- **Mark as Cancelled:** Keeps the record but marks it inactive
- **Delete:** Permanently removes the subscription
- **Edit:** Update any subscription details

### Calendar View
- Navigate between months using arrow buttons
- Days with bills are highlighted in blue
- See total amount and bill count per day
- Click on bills to view details

## 🎯 Core Technologies

- **Frontend:** React 18 with TypeScript
- **Routing:** React Router v7 (Data Mode)
- **Styling:** Tailwind CSS v4
- **UI Components:** Radix UI primitives
- **Date Handling:** date-fns
- **State Management:** React Context API
- **Storage:** LocalStorage (no backend required)

## 📊 Smart Parsing Features

The text parser can extract information from various formats:

- **Amounts:** ฿299, THB 299, $9.99, USD 9.99, 299 บาท
- **Dates:** 
  - ISO format: 2026-02-28
  - DD/MM/YYYY or DD-MM-YYYY
  - Thai format: 28 ก.พ. 2569
  - English: Feb 28, 2026
- **Services:** Recognizes popular services like Netflix, Spotify, Disney+, etc.
- **Trial Detection:** Identifies keywords like "trial", "free trial", "ทดลองใช้ฟรี"

## 🔐 Privacy & Security

- ✅ All data stored locally on your device
- ✅ No external servers or databases
- ✅ No data sent over the internet
- ✅ No tracking or analytics
- ⚠️ Not meant for highly sensitive financial data
- ⚠️ Use for personal subscription tracking only

## 📱 Mobile-First Design

- Responsive layout for all screen sizes
- Bottom navigation bar on mobile
- Sidebar navigation on desktop
- Touch-friendly interface
- Optimized for both portrait and landscape

## 🔔 Notification Support

Enable browser notifications to get reminders:
- 3 days before a bill is due
- When trials are about to end
- Requires notification permission

## 🎨 Supported Categories

- Entertainment (Netflix, Disney+, HBO)
- Music (Spotify, Apple Music, JOOX)
- Cloud Storage (Google Drive, Dropbox, iCloud)
- Productivity (Microsoft 365, Adobe, Notion)
- Gaming (Xbox Game Pass, PlayStation Plus)
- Shopping (Amazon Prime, Shopee Premium)
- Telecom (AIS, True, DTAC)
- Other (Custom subscriptions)

## 📈 Future Improvements

- Firebase backend integration for cloud sync
- Export data to CSV/PDF
- Budget goals and spending insights
- Receipt photo upload
- Email integration (Gmail, Outlook)
- Spending analytics and charts
- Multi-currency conversion
- Family sharing features

## 🐛 Known Limitations

- Text parsing works best with structured receipts
- Complex email formats may require manual adjustment
- Notifications only work when browser is open
- No automatic sync across devices (local storage only)
- Dark mode UI not yet implemented

## 📞 Support

This is a student project created for educational purposes. 

**Developer:** Ye Myat Min  
**Student ID:** 6731503094  
**Institution:** Thailand University  
**Course:** Mobile Application Development  
**Year:** 2026

---

**Note:** This application is a prototype/MVP created as part of a mini-project assignment. It demonstrates core subscription tracking functionality without requiring backend infrastructure.
