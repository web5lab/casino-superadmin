export interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  passwordLastChanged: string;
}

export interface NotificationSettings {
  emailEnabled: boolean;
  pushEnabled: boolean;
  transactionThreshold: number;
}

export interface PaymentSettings {
  dailyLimit: number;
  monthlyLimit: number;
  autoApprovalLimit: number;
}

export interface BlockchainWallet {
  address: string;
  balance: number;
  extraInfo?: {
    [key: string]: {
      amount: number;
      color: string;
    };
  };
}

export interface NetworkWallets {
  adminWallet: BlockchainWallet;
  fundingWallet: BlockchainWallet;
}

export interface WalletSettings {
  ethereum: NetworkWallets;
  solana: NetworkWallets;
  bitcoin: NetworkWallets;
  tron: NetworkWallets;
}