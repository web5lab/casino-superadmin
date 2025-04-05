import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.Schema.js';
import Casino from './models/Casino.Schema.js';
import Currency from './models/Currency.Schema.js';
import Transaction from './models/Transaction.Schema.js';
import Wallet from './models/Wallet.Schema.js';
import casinoStatsSchema from './models/casinoStats.Schema.js';

dotenv.config();
const clearCollections = async () => {
  console.log('Clearing existing data...');
  await Casino.deleteMany({});
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
      permissions: ['CREATE_USERS'],
      isActive: true,
      lastActive: new Date()
    },
    {
      name: 'Panel Admin',
      email: 'panel@cryptopay.com',
      password,
      role: 'PANEL_ADMIN',
      isActive: true,
      lastActive: new Date(),
      permissions: ['CREATE_USERS'],
      casinoId: '67dc7758c341ec2e6d553c40'
    }
  ];
  await User.insertMany(users);
};

const seedCasinos = async () => {
  console.log('Seeding casinos...');
  const casinos = [
    // {
    //   _id: "67dc7758c341ec2e6d553c40",
    //   name: 'Demo',
    //   status: 'active',
    //   balance: 1,
    //   transactions: 1,
    //   apiConfig: {
    //     balanceApi: 'http://localhost:3009/balance',
    //     userAuthApi: 'http://localhost:3009/user',
    //     depositApi: 'http://localhost:3009/credit-server',
    //     deductionApi: 'http://localhost:3009/deduction-server',
    //     secretKey: 'sk_live_123456789'
    //   },
    //   theme: {
    //     primaryColor: '#FFA500',
    //     secondaryColor: '#90EE90',
    //     logo: 'https://example.com/royal-casino-logo.png'
    //   },
    //   masterPhrase: "cream palace fence interest emotion syrup clog parade family radio swear remove",
    //   wallet: [{
    //     walletType: "EVM",
    //     walletAddress: "0x0e170E7Efe1458fe9049ACeC8B4433b79a0A7DBB",
    //     balance: 0,
    //     currency: "USDT",
    //     lastUpdatedBlockNumber: 0,
    //     icon: 'https://cryptologos.cc/logos/tether-usdt-logo.svg?v=040',
    //     tokenAddress: "0x16B59e2d8274f2031c0eF4C9C460526Ada40BeDa"
    //   }]
    // },
    {
      _id: "67dc7758c341ec2e6d553c41",
      name: 'Royal Casino',
      status: 'active',
      balance: 1,
      transactions: 1,
      apiConfig: {
        balanceApi: 'http://143.244.138.179:8080/admin-new-apis/crypto/api/get-balance',
        userAuthApi: 'http://143.244.138.179:8080/admin-new-apis/crypto/api/auth',
        depositApi: 'http://143.244.138.179:8080/admin-new-apis/crypto/api/credit-balance',
        deductionApi: 'http://143.244.138.179:8080/admin-new-apis/crypto/api/deduct-balance',
        secretKey: 'sk_live_123456789'
      },
      theme: {
        primaryColor: '#FFA500',
        secondaryColor: '#90EE90',
        logo: 'https://example.com/royal-casino-logo.png'
      },
      masterPhrase: "cream palace fence interest emotion syrup clog parade family radio swear remove",
      wallet: [{
        walletType: "EVM",
        walletAddress: "0x0e170E7Efe1458fe9049ACeC8B4433b79a0A7DBB",
        balance: 0,
        currency: "USDT",
        lastUpdatedBlockNumber: 0,
        icon: 'https://cryptologos.cc/logos/tether-usdt-logo.svg?v=040',
        tokenAddress: "0x16B59e2d8274f2031c0eF4C9C460526Ada40BeDa"
      }]
    }
  ];
  await Casino.insertMany(casinos);
  await casinoStatsSchema.create({
    casinoId: casinos[0]._id,
    totalUsers: 0,
    totalVolumes: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    currencyVolume: [{
      currencyName: 'USDT',
      volume: 0
    }],
    pendingWithdrawals: 0,
    approvedWithdrawals: 0,
    rejectedWithdrawals: 0
  })
};

const seedCurrencies = async () => {
  console.log('Seeding currencies...');
  const currencies = [
    {
      code: 'USDT',
      name: 'Tether',
      symbol: '₮',
      enabled: true,
      icon: 'https://cryptologos.cc/logos/tether-usdt-logo.svg?v=040',
      exchangeRate: 1.0
    }
  ];

  await Currency.insertMany(currencies);
};



const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to MongoDB');

    // await clearCollections();
    await seedCasinos();


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