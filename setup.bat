@echo off
REM TrialGuard Project Setup Script for Windows
REM Creates the complete feature-based folder structure

echo 🚀 Setting up TrialGuard project structure...

REM Create main source directory
mkdir src 2>nul

REM Create app directory (navigation)
mkdir src\app 2>nul
echo 📱 Created app directory

REM Create core directory (theme, constants, utilities)
mkdir src\core 2>nul
echo ⚙️ Created core directory

REM Create models directory
mkdir src\models 2>nul
echo 📋 Created models directory

REM Create services directory
mkdir src\services 2>nul
echo 🔧 Created services directory

REM Create store directory (Zustand)
mkdir src\store 2>nul
echo 🗃️ Created store directory

REM Create features directory structure
mkdir src\features 2>nul

REM Auth feature
mkdir src\features\auth 2>nul
mkdir src\features\auth\screens 2>nul
mkdir src\features\auth\components 2>nul
echo 🔐 Created auth feature structure

REM Dashboard feature
mkdir src\features\dashboard 2>nul
mkdir src\features\dashboard\screens 2>nul
mkdir src\features\dashboard\components 2>nul
echo 📊 Created dashboard feature structure

REM Subscriptions feature
mkdir src\features\subscriptions 2>nul
mkdir src\features\subscriptions\screens 2>nul
mkdir src\features\subscriptions\components 2>nul
echo 📝 Created subscriptions feature structure

REM Calendar feature
mkdir src\features\calendar 2>nul
mkdir src\features\calendar\screens 2>nul
mkdir src\features\calendar\components 2>nul
echo 📅 Created calendar feature structure

REM Settings feature
mkdir src\features\settings 2>nul
mkdir src\features\settings\screens 2>nul
mkdir src\features\settings\components 2>nul
echo ⚙️ Created settings feature structure

REM Create assets directory
mkdir assets 2>nul
echo 🎨 Created assets directory

echo.
echo ✅ TrialGuard project structure created successfully!
echo.
echo Project Structure:
echo ├── src/
echo │   ├── app/                 # Navigation setup
echo │   ├── core/                # Theme, constants, utilities
echo │   ├── models/              # TypeScript interfaces
echo │   ├── services/            # Firebase, parsing logic
echo │   ├── store/               # Zustand stores
echo │   └── features/
echo │       ├── auth/            # Authentication
echo │       │   ├── screens/
echo │       │   └── components/
echo │       ├── dashboard/       # Home dashboard
echo │       │   ├── screens/
echo │       │   └── components/
echo │       ├── subscriptions/   # Subscription management
echo │       │   ├── screens/
echo │       │   └── components/
echo │       ├── calendar/        # Calendar view
echo │       │   ├── screens/
echo │       │   └── components/
echo │       └── settings/        # App settings
echo │           ├── screens/
echo │           └── components/
echo ├── assets/                  # Images, fonts
echo ├── App.tsx                  # Main entry point
echo └── package.json             # Dependencies
echo.
echo 🚀 Next steps:
echo 1. Run 'npm install' to install dependencies
echo 2. Run 'npm run start' to start the development server  
echo 3. Configure Firebase credentials in src\services\firebase.ts
echo.
pause