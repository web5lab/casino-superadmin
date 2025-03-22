import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.Schema.js';
import Casino from './models/Casino.Schema.js';
import Currency from './models/Currency.Schema.js';
import Transaction from './models/Transaction.Schema.js';
import Wallet from './models/Wallet.Schema.js';
import { generateMasterPhrase } from './services/wallet.services.js';

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
    {
      _id:"67dc7758c341ec2e6d553c40",
      name: 'Demo',
      status: 'active',
      balance: 1,
      transactions: 1,
      apiConfig: {
        balanceApi: 'http://localhost:3009/balance',
        userAuthApi: 'http://localhost:3009/user',
        depositApi: 'http://localhost:3009/credit-server',
        deductionApi: 'http://localhost:3009/deduction-server',
        secretKey: 'sk_live_123456789'
      },
      theme: {
        primaryColor: '#FFA500',
        secondaryColor: '#90EE90',
        logo: 'https://example.com/royal-casino-logo.png'
      },
      masterPhrase:await generateMasterPhrase()
    }
  ];
  await Casino.insertMany(casinos);
};

const seedCurrencies = async () => {
  console.log('Seeding currencies...');
  const currencies = [
    {
      code: 'USDT',
      name: 'Tether',
      symbol: '₮',
      enabled: true,
      icon:'https://cryptologos.cc/logos/tether-usdt-logo.svg?v=040',
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

    await clearCollections();
    await seedUsers();
    await seedCasinos();
    await seedCurrencies();


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