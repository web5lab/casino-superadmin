import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import Wallet from '../models/Wallet.Schema.js';
import { blockchainUtils, monitorAddress, walletGenerator, keystore } from '../utils/blockchain/index.js';
import { sendTransactionAlert } from '../utils/mailer.js';

const router = express.Router();

// Get all wallets
router.get('/', authenticateToken, async (req, res) => {
  try {
    const wallets = await Wallet.find();
    res.json(wallets);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get wallet by network and type
router.get('/:network/:type', authenticateToken, async (req, res) => {
  try {
    const { network, type } = req.params;
    const wallet = await Wallet.findOne({ network, type });
    
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }
    
    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or update wallet
router.post('/', [
  authenticateToken,
  requireRole(['SUPER_ADMIN']),
  body('network').isIn(['ethereum', 'solana', 'bitcoin', 'tron']),
  body('type').isIn(['adminWallet', 'fundingWallet']),
  body('address').notEmpty(),
  body('balance').isNumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { network, type, address, balance, extraInfo } = req.body;
    
    // Validate blockchain address
    const utils = blockchainUtils.getUtilsByNetwork(network);
    if (!utils.validateAddress(address)) {
      return res.status(400).json({ message: 'Invalid blockchain address' });
    }

    const wallet = await Wallet.findOneAndUpdate(
      { network, type },
      { address, balance, extraInfo },
      { new: true, upsert: true }
    );

    // Start monitoring the wallet
    monitorAddress(network, address, async (update) => {
      const wallet = await Wallet.findOne({ network, type });
      if (wallet) {
        wallet.balance = update.currentBalance;
        await wallet.save();

        // Send email alert for significant changes
        if (Math.abs(update.currentBalance - update.previousBalance) > 1000) {
          await sendTransactionAlert({
            amount: Math.abs(update.currentBalance - update.previousBalance),
            currency: network.toUpperCase(),
            status: 'completed',
            network,
            walletAddress: address,
            createdAt: new Date()
          }, process.env.SMTP_USER);
        }
      }
    });

    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate new wallet
router.post('/generate', [
  authenticateToken,
  requireRole(['SUPER_ADMIN']),
  body('network').isIn(['ethereum', 'solana', 'bitcoin']),
  body('type').isIn(['adminWallet', 'fundingWallet'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { network, type } = req.body;
    const generator = walletGenerator[network];

    if (!generator) {
      return res.status(400).json({ message: 'Unsupported network' });
    }

    // Generate wallet and encrypt private key
    const wallet = generator.generateWallet();
    const password = keystore.generatePassword();
    const encryptedPrivateKey = keystore.encryptPrivateKey(wallet.privateKey, password);

    // Save wallet to database
    const savedWallet = await Wallet.findOneAndUpdate(
      { network, type },
      {
        address: wallet.address,
        balance: 0,
        encryptedPrivateKey
      },
      { new: true, upsert: true }
    );

    // Start monitoring the new wallet
    monitorAddress(network, wallet.address, async (update) => {
      const wallet = await Wallet.findOne({ network, type });
      if (wallet) {
        wallet.balance = update.currentBalance;
        await wallet.save();
      }
    });

    // Return wallet info (including password for initial setup)
    res.json({
      wallet: savedWallet,
      password,
      message: 'Store this password securely. It will only be shown once.'
    });
  } catch (error) {
    console.error('Wallet generation error:', error);
    res.status(500).json({ message: 'Failed to generate wallet' });
  }
});

// Import existing wallet
router.post('/import', [
  authenticateToken,
  requireRole(['SUPER_ADMIN']),
  body('network').isIn(['ethereum', 'solana', 'bitcoin']),
  body('type').isIn(['adminWallet', 'fundingWallet']),
  body('privateKey').notEmpty(),
  body('password').isLength({ min: 8 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { network, type, privateKey, password } = req.body;

    // Validate private key format
    if (!blockchainUtils.validatePrivateKey[network](privateKey)) {
      return res.status(400).json({ message: 'Invalid private key format' });
    }

    // Encrypt private key
    const encryptedPrivateKey = keystore.encryptPrivateKey(privateKey, password);

    // Generate address from private key
    const utils = blockchainUtils.getUtilsByNetwork(network);
    const address = utils.getAddressFromPrivateKey(privateKey);

    // Save wallet to database
    const wallet = await Wallet.findOneAndUpdate(
      { network, type },
      {
        address,
        balance: 0,
        encryptedPrivateKey
      },
      { new: true, upsert: true }
    );

    // Start monitoring
    monitorAddress(network, address, async (update) => {
      const wallet = await Wallet.findOne({ network, type });
      if (wallet) {
        wallet.balance = update.currentBalance;
        await wallet.save();
      }
    });

    res.json(wallet);
  } catch (error) {
    console.error('Wallet import error:', error);
    res.status(500).json({ message: 'Failed to import wallet' });
  }
});

// Update wallet balance
router.patch('/:network/:type/balance', [
  authenticateToken,
  requireRole(['SUPER_ADMIN']),
  body('balance').isNumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { network, type } = req.params;
    const { balance } = req.body;

    const wallet = await Wallet.findOneAndUpdate(
      { network, type },
      { balance },
      { new: true }
    );

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;