import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  userId: string;
  fullName: string;
  email: string;
  preferences: {
    darkMode: boolean;
    currency: string;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updatePreferences: (preferences: Partial<User['preferences']>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initialize demo account
const initializeDemoAccount = () => {
  const users = JSON.parse(localStorage.getItem('trialguard_users') || '[]');
  
  // Check if demo account already exists
  if (!users.find((u: any) => u.email === 'demo@student.com')) {
    users.push({
      userId: 'u_demo',
      fullName: 'Demo Student',
      email: 'demo@student.com',
      password: 'demo123',
      preferences: {
        darkMode: false,
        currency: 'THB',
      },
    });
    localStorage.setItem('trialguard_users', JSON.stringify(users));
    
    // Add sample subscriptions for demo account
    const demoSubscriptions = [
      {
        id: 'sub_demo_1',
        serviceName: 'Netflix',
        category: 'Entertainment',
        monthlyCost: 299,
        currency: 'THB',
        billingCycle: 'monthly',
        nextBillDate: '2026-03-01',
        isTrial: false,
        status: 'active',
        notes: 'Premium plan with 4K streaming',
      },
      {
        id: 'sub_demo_2',
        serviceName: 'Spotify Premium',
        category: 'Music',
        monthlyCost: 129,
        currency: 'THB',
        billingCycle: 'monthly',
        nextBillDate: '2026-02-25',
        isTrial: false,
        status: 'active',
        notes: 'Student discount applied',
      },
      {
        id: 'sub_demo_3',
        serviceName: 'Disney+',
        category: 'Entertainment',
        monthlyCost: 9.99,
        currency: 'USD',
        billingCycle: 'monthly',
        nextBillDate: '2026-02-28',
        isTrial: true,
        trialEndDate: '2026-02-26',
        status: 'active',
        notes: '7-day free trial - remember to cancel!',
      },
    ];
    localStorage.setItem('trialguard_subscriptions_u_demo', JSON.stringify(demoSubscriptions));
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Initialize demo account on first load
    initializeDemoAccount();
    
    // Load user from localStorage on mount
    const savedUser = localStorage.getItem('trialguard_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - in real app this would call Firebase Auth
    const users = JSON.parse(localStorage.getItem('trialguard_users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('trialguard_user', JSON.stringify(userWithoutPassword));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (fullName: string, email: string, password: string) => {
    // Mock registration - in real app this would call Firebase Auth
    const users = JSON.parse(localStorage.getItem('trialguard_users') || '[]');
    
    if (users.find((u: any) => u.email === email)) {
      throw new Error('Email already exists');
    }

    const newUser = {
      userId: `u_${Date.now()}`,
      fullName,
      email,
      password,
      preferences: {
        darkMode: false,
        currency: 'THB',
      },
    };

    users.push(newUser);
    localStorage.setItem('trialguard_users', JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('trialguard_user', JSON.stringify(userWithoutPassword));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('trialguard_user');
  };

  const updatePreferences = (preferences: Partial<User['preferences']>) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      preferences: {
        ...user.preferences,
        ...preferences,
      },
    };
    
    setUser(updatedUser);
    localStorage.setItem('trialguard_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updatePreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
