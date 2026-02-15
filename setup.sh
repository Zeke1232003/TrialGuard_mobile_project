#!/bin/bash

# TrialGuard Project Setup Script
# Creates the complete feature-based folder structure

echo "🚀 Setting up TrialGuard project structure..."

# Create main source directory
mkdir -p src

# Create app directory (navigation)
mkdir -p src/app
echo "📱 Created app directory"

# Create core directory (theme, constants, utilities)
mkdir -p src/core
echo "⚙️ Created core directory"

# Create models directory
mkdir -p src/models
echo "📋 Created models directory"

# Create services directory
mkdir -p src/services
echo "🔧 Created services directory"

# Create store directory (Zustand)
mkdir -p src/store
echo "🗃️ Created store directory"

# Create features directory structure
mkdir -p src/features

# Auth feature
mkdir -p src/features/auth/screens
mkdir -p src/features/auth/components
echo "🔐 Created auth feature structure"

# Dashboard feature
mkdir -p src/features/dashboard/screens
mkdir -p src/features/dashboard/components
echo "📊 Created dashboard feature structure"

# Subscriptions feature
mkdir -p src/features/subscriptions/screens
mkdir -p src/features/subscriptions/components
echo "📝 Created subscriptions feature structure"

# Calendar feature
mkdir -p src/features/calendar/screens
mkdir -p src/features/calendar/components
echo "📅 Created calendar feature structure"

# Settings feature
mkdir -p src/features/settings/screens
mkdir -p src/features/settings/components
echo "⚙️ Created settings feature structure"

# Create assets directory
mkdir -p assets
echo "🎨 Created assets directory"

echo ""
echo "✅ TrialGuard project structure created successfully!"
echo ""
echo "Project Structure:"
echo "├── src/"
echo "│   ├── app/                 # Navigation setup"
echo "│   ├── core/                # Theme, constants, utilities"
echo "│   ├── models/              # TypeScript interfaces"
echo "│   ├── services/            # Firebase, parsing logic"
echo "│   ├── store/               # Zustand stores"
echo "│   └── features/"
echo "│       ├── auth/            # Authentication"
echo "│       │   ├── screens/"
echo "│       │   └── components/"
echo "│       ├── dashboard/       # Home dashboard"
echo "│       │   ├── screens/"
echo "│       │   └── components/"
echo "│       ├── subscriptions/   # Subscription management"
echo "│       │   ├── screens/"
echo "│       │   └── components/"
echo "│       ├── calendar/        # Calendar view"
echo "│       │   ├── screens/"
echo "│       │   └── components/"
echo "│       └── settings/        # App settings"
echo "│           ├── screens/"
echo "│           └── components/"
echo "├── assets/                  # Images, fonts"
echo "├── App.tsx                  # Main entry point"
echo "└── package.json             # Dependencies"
echo ""
echo "🚀 Next steps:"
echo "1. Run 'npm install' to install dependencies"
echo "2. Run 'npm run start' to start the development server"
echo "3. Configure Firebase credentials in src/services/firebase.ts"
echo ""