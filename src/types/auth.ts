export type UserRole = 'SUPER_ADMIN' | 'PANEL_ADMIN';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  casinoId: string;
  walletAddress: string;
  network: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  enabled: boolean;
  exchangeRate: number;
  lastUpdated: string;
}

export interface Casino {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  balance: number;
  transactions: number;
  lastActive: string;
  apiConfig: {
    balanceApi: string;
    depositApi: string;
    deductionApi: string;
    secretKey: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    logo?: string;
  };
}