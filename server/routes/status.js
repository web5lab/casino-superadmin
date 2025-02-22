import express from 'express';
import mongoose from 'mongoose';
import Casino from '../models/Casino.js';
import Transaction from '../models/Transaction.js';
import Wallet from '../models/Wallet.js';
import { blockchainUtils } from '../utils/blockchain/index.js';

const router = express.Router();

// Get system status
router.get('/', async (req, res) => {
  try {
    // Get MongoDB status
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

    // Get basic stats
    const [
      activeCasinos,
      pendingTransactions,
      totalTransactions,
      wallets
    ] = await Promise.all([
      Casino.countDocuments({ status: 'active' }),
      Transaction.countDocuments({ status: 'pending' }),
      Transaction.countDocuments(),
      Wallet.find()
    ]);

    // Check blockchain connections
    const blockchainStatuses = {};
    for (const network of ['ethereum', 'solana', 'bitcoin']) {
      try {
        const utils = blockchainUtils.getUtilsByNetwork(network);
        // Try to get balance of a test address to verify connection
        await utils.getBalance('0x0000000000000000000000000000000000000000');
        blockchainStatuses[network] = 'connected';
      } catch (error) {
        blockchainStatuses[network] = 'error';
      }
    }

    // Calculate system uptime
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);

    // Get memory usage
    const memoryUsage = process.memoryUsage();
    const usedMemoryMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    const totalMemoryMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);

    res.json({
      status: 'operational',
      timestamp: new Date(),
      services: {
        database: {
          status: dbStatus,
          activeCasinos,
          pendingTransactions,
          totalTransactions
        },
        blockchain: blockchainStatuses,
        wallets: {
          total: wallets.length,
          byNetwork: wallets.reduce((acc, wallet) => {
            acc[wallet.network] = (acc[wallet.network] || 0) + 1;
            return acc;
          }, {})
        }
      },
      system: {
        uptime: {
          days,
          hours,
          minutes,
          total_seconds: Math.floor(uptime)
        },
        memory: {
          used: usedMemoryMB,
          total: totalMemoryMB,
          unit: 'MB'
        },
        version: process.version,
        environment: process.env.NODE_ENV || 'development'
      }
    });
  } catch (error) {
    console.error('Status check failed:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to retrieve system status',
      timestamp: new Date()
    });
  }
});

// Get detailed metrics (Super Admin only)
router.get('/metrics',async (req, res) => {
  try {
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
      dailyTransactions,
      weeklyTransactions,
      transactionsByStatus,
      transactionsByNetwork,
      walletBalances
    ] = await Promise.all([
      Transaction.countDocuments({ createdAt: { $gte: last24Hours } }),
      Transaction.countDocuments({ createdAt: { $gte: last7Days } }),
      Transaction.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Transaction.aggregate([
        { $group: { _id: '$network', count: { $sum: 1 }, volume: { $sum: '$amount' } } }
      ]),
      Wallet.find().select('network type balance')
    ]);

    res.json({
      transactions: {
        last24Hours: dailyTransactions,
        last7Days: weeklyTransactions,
        byStatus: transactionsByStatus.reduce((acc, { _id, count }) => {
          acc[_id] = count;
          return acc;
        }, {}),
        byNetwork: transactionsByNetwork.reduce((acc, { _id, count, volume }) => {
          acc[_id] = { count, volume };
          return acc;
        }, {})
      },
      wallets: {
        balances: walletBalances.reduce((acc, wallet) => {
          if (!acc[wallet.network]) acc[wallet.network] = {};
          acc[wallet.network][wallet.type] = wallet.balance;
          return acc;
        }, {})
      },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Metrics retrieval failed:', error);
    res.status(500).json({ message: 'Failed to retrieve metrics' });
  }
}) ;

export default router;