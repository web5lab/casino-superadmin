import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Casino from './models/Casino.js';
import Currency from './models/Currency.js';
import Transaction from './models/Transaction.js';
import Wallet from './models/Wallet.js';
import { keystore } from './utils/blockchain/keystore.js';

dotenv.config();

const clearCollections = async () => {
  console.log('Clearing existing data...');
  await User.deleteMany({});
  await Casino.deleteMany({});
  await Currency.deleteMany({});
  await Transaction.deleteMany({});
  await Wallet.deleteMany({});
};

const seedUsers = async () => {
  console.log('Seeding users...');
  const password = await bcrypt.hash('admin', 10);
  
  const users = [
    {
      name: 'Super Admin',
      email: 'admin@example.com',
      password,
      role: 'SUPER_ADMIN',
      isActive: true,
      lastActive: new Date()
    },
    {
      name: 'Panel Admin',
      email: 'panel@cryptopay.com',
      password,
      role: 'PANEL_ADMIN',
      isActive: true,
      lastActive: new Date()
    }
  ];

  await User.insertMany(users);
};

const seedCasinos = async () => {
  console.log('Seeding casinos...');
  const casinos = [
    {
      name: 'Royal Casino',
      status: 'active',
      balance: 1250000.00,
      transactions: 1234,
      apiConfig: {
        balanceApi: 'https://api.royalcasino.com/balance',
        depositApi: 'https://api.royalcasino.com/deposit',
        deductionApi: 'https://api.royalcasino.com/deduct',
        secretKey: 'sk_live_123456789'
      },
      theme: {
        primaryColor: '#FFA500',
        secondaryColor: '#90EE90',
        logo: 'https://example.com/royal-casino-logo.png'
      }
    },
    {
      name: 'Lucky Strike',
      status: 'active',
      balance: 750000.00,
      transactions: 856,
      apiConfig: {
        balanceApi: 'https://api.luckystrike.com/balance',
        depositApi: 'https://api.luckystrike.com/deposit',
        deductionApi: 'https://api.luckystrike.com/deduct',
        secretKey: 'sk_live_987654321'
      },
      theme: {
        primaryColor: '#4169E1',
        secondaryColor: '#FFD700'
      }
    }
  ];

  await Casino.insertMany(casinos);
};

const seedCurrencies = async () => {
  console.log('Seeding currencies...');
  const currencies = [
    {
      code: 'BTC',
      name: 'Bitcoin',
      symbol: '₿',
      enabled: true,
      icon:'',
      exchangeRate: 0.000023
    },
    {
      code: 'ETH',
      name: 'Ethereum',
      symbol: 'Ξ',
      enabled: true,
      icon:'',
      exchangeRate: 0.00034
    },
    {
      code: 'SOL',
      name: 'Solana',
      symbol: 'SOL',
      enabled: true,
      icon:'',
      exchangeRate: 0.0125
    },
    {
      code: 'USDT',
      name: 'Tether',
      symbol: '₮',
      enabled: true,
      icon:'',
      exchangeRate: 1.0
    }
  ];

  await Currency.insertMany(currencies);
};

const seedWallets = async () => {
  console.log('Seeding wallets...');
  const password = keystore.generatePassword();
  const privateKeys = {
    ethereum: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    solana: '123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234',
    bitcoin: 'L1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
  };

  const wallets = [
    {
      network: 'ethereum',
      type: 'adminWallet',
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      encryptedPrivateKey: keystore.encryptPrivateKey(privateKeys.ethereum, password),
      balance: 25000.50
    },
    {
      network: 'ethereum',
      type: 'fundingWallet',
      address: '0x123f681646d4a755815f9cb19e1acc8565a0c2ac',
      encryptedPrivateKey: keystore.encryptPrivateKey(privateKeys.ethereum, password),
      balance: 5000.75
    },
    {
      network: 'solana',
      type: 'adminWallet',
      address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      encryptedPrivateKey: keystore.encryptPrivateKey(privateKeys.solana, password),
      balance: 15000.25
    },
    {
      network: 'solana',
      type: 'fundingWallet',
      address: '3Kz9QYZgSEqXWzbCaEy9thgFd8UJFMkf8QWL6tzeqNT3',
      encryptedPrivateKey: keystore.encryptPrivateKey(privateKeys.solana, password),
      balance: 3000.50
    },
    {
      network: 'bitcoin',
      type: 'adminWallet',
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      encryptedPrivateKey: keystore.encryptPrivateKey(privateKeys.bitcoin, password),
      balance: 45000.75
    },
    {
      network: 'bitcoin',
      type: 'fundingWallet',
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      encryptedPrivateKey: keystore.encryptPrivateKey(privateKeys.bitcoin, password),
      balance: 8000.25
    }
  ];

  await Wallet.insertMany(wallets);
  console.log('Wallet password (save this):', password);
};

const seedTransactions = async () => {
  console.log('Seeding transactions...');
  const casinos = await Casino.find();
  const statuses = ['completed', 'pending', 'failed'];
  const networks = ['ethereum', 'solana', 'bitcoin'];
  const currencies = ['BTC', 'ETH', 'SOL', 'USDT'];
  
  const transactions = Array.from({ length: 50 }, () => ({
    amount: Math.random() * 10000,
    currency: currencies[Math.floor(Math.random() * currencies.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    casinoId: casinos[Math.floor(Math.random() * casinos.length)]._id,
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    network: networks[Math.floor(Math.random() * networks.length)],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000))
  }));

  await Transaction.insertMany(transactions);
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB');

    await clearCollections();
    await seedUsers();
    await seedCasinos();
    await seedCurrencies();
    await seedWallets();
    await seedTransactions();

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('\nSeeding failed:', error.message);
    if (error.name === 'MongooseServerSelectionError') {
      console.error('\nMake sure:');
      console.error('1. MongoDB is running');
      console.error('2. Your MONGODB_URI in .env is correct');
      console.error('3. Network allows connection to MongoDB\n');
    }
    process.exit(1);
  }
};

seed();