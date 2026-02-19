export interface Subscription {
  id: string;
  serviceName: string;
  category: string;
  monthlyCost: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly' | 'weekly';
  nextBillDate: string;
  isTrial: boolean;
  trialEndDate?: string;
  status: 'active' | 'cancelled';
  notes?: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  preferences: {
    currency: 'THB' | 'USD';
    notifications: boolean;
  };
}

// Mock user data
export const mockUser: User = {
  id: '1',
  fullName: 'Ye Myat Min',
  email: 'demo@student.com',
  preferences: {
    currency: 'THB',
    notifications: true,
  },
};

// Mock subscription data
export const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    serviceName: 'Netflix',
    category: 'Entertainment',
    monthlyCost: 419,
    currency: 'THB',
    billingCycle: 'monthly',
    nextBillDate: '2026-03-15',
    isTrial: false,
    status: 'active',
    notes: 'Premium plan - 4 screens',
  },
  {
    id: '2',
    serviceName: 'Spotify',
    category: 'Music',
    monthlyCost: 129,
    currency: 'THB',
    billingCycle: 'monthly',
    nextBillDate: '2026-03-01',
    isTrial: false,
    status: 'active',
    notes: 'Student discount',
  },
  {
    id: '3',
    serviceName: 'Disney+',
    category: 'Entertainment',
    monthlyCost: 349,
    currency: 'THB',
    billingCycle: 'monthly',
    nextBillDate: '2026-02-25',
    isTrial: true,
    trialEndDate: '2026-02-25',
    status: 'active',
    notes: 'Free trial ending soon!',
  },
  {
    id: '4',
    serviceName: 'Adobe Creative Cloud',
    category: 'Productivity',
    monthlyCost: 1180,
    currency: 'THB',
    billingCycle: 'monthly',
    nextBillDate: '2026-03-10',
    isTrial: false,
    status: 'active',
    notes: 'Student license',
  },
  {
    id: '5',
    serviceName: 'YouTube Premium',
    category: 'Entertainment',
    monthlyCost: 149,
    currency: 'THB',
    billingCycle: 'monthly',
    nextBillDate: '2026-03-05',
    isTrial: false,
    status: 'active',
  },
  {
    id: '6',
    serviceName: 'Notion',
    category: 'Productivity',
    monthlyCost: 0,
    currency: 'THB',
    billingCycle: 'monthly',
    nextBillDate: '2026-02-23',
    isTrial: true,
    trialEndDate: '2026-02-23',
    status: 'active',
    notes: 'Free for students',
  },
];
