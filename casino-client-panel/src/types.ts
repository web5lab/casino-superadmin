export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  userId: string;
}

export interface CurrencyConfig {
  symbol: string;
  name: string;
  fee: number;
  enabled: boolean;
}

export interface AnalyticsData {
  totalVolume: number;
  activeUsers: number;
  revenue: number;
  trend: number;
}

export type Permission = 'transactions' | 'users' | 'withdrawals' | 'analytics' | 'compliance' | 'settings';

export interface SubAdmin {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: Permission[];
  status: 'active' | 'inactive';
  lastLogin: string;
}