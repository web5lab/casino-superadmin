import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import Currency from '../models/Currency.js';

const router = express.Router();

// Get all currencies
router.get('/get-currencies', async (req, res) => {
  try {
    const currencies = await Currency.find();
    res.json(currencies);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/currencies', async (req, res) => {
  try {
    const currencies = await Currency.find();
    res.json(currencies);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get currency by code
router.get('/:code', authenticateToken, async (req, res) => {
  try {
    const currency = await Currency.findOne({ code: req.params.code.toUpperCase() });
    if (!currency) {
      return res.status(404).json({ message: 'Currency not found' });
    }
    res.json(currency);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new currency
router.post('/', [
  authenticateToken,
  requireRole(['SUPER_ADMIN']),
  body('code').isLength({ min: 2, max: 5 }),
  body('name').notEmpty(),
  body('symbol').notEmpty(),
  body('exchangeRate').isNumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { code, name, symbol, exchangeRate } = req.body;

    const currencyExists = await Currency.findOne({ code: code.toUpperCase() });
    if (currencyExists) {
      return res.status(400).json({ message: 'Currency already exists' });
    }

    const currency = new Currency({
      code: code.toUpperCase(),
      name,
      symbol,
      exchangeRate
    });

    await currency.save();
    res.status(201).json(currency);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update currency
router.put('/:code', [
  authenticateToken,
  requireRole(['SUPER_ADMIN']),
  body('name').optional().notEmpty(),
  body('symbol').optional().notEmpty(),
  body('exchangeRate').optional().isNumeric(),
  body('enabled').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const currency = await Currency.findOneAndUpdate(
      { code: req.params.code.toUpperCase() },
      req.body,
      { new: true }
    );

    if (!currency) {
      return res.status(404).json({ message: 'Currency not found' });
    }

    res.json(currency);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle currency status
router.patch('/:code/toggle', authenticateToken, requireRole(['SUPER_ADMIN']), async (req, res) => {
  try {
    const currency = await Currency.findOne({ code: req.params.code.toUpperCase() });
    if (!currency) {
      return res.status(404).json({ message: 'Currency not found' });
    }

    currency.enabled = !currency.enabled;
    await currency.save();

    res.json(currency);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;