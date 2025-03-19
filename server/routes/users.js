import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import User from '../models/User.Schema.js';
import { getUserWallet, refreshWallet, requestWithdrwal,  userTransactions } from '../controller/casino.controller.js';

const router = express.Router();

// Get all users (Super Admin only)
router.get('/', authenticateToken, requireRole(['SUPER_ADMIN']), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new user (Super Admin only)
router.post('/', [
  authenticateToken,
  requireRole(['SUPER_ADMIN']),
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['SUPER_ADMIN', 'PANEL_ADMIN'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      name,
      email,
      password,
      role
    });

    await user.save();
    const { password: _, ...userResponse } = user.toObject();
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user
router.put('/:id', [
  authenticateToken,
  requireRole(['SUPER_ADMIN']),
  body('name').optional().notEmpty(),
  body('email').optional().isEmail(),
  body('role').optional().isIn(['SUPER_ADMIN', 'PANEL_ADMIN'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    await user.save();
    const { password: _, ...userResponse } = user.toObject();
    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Deactivate user
router.delete('/:id', authenticateToken, requireRole(['SUPER_ADMIN']), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = false;
    await user.save();
    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/user-address', getUserWallet);
router.post('/refresh-wallet', refreshWallet);
router.post('/user-transactions', userTransactions);
router.post('/request-withdrawl', requestWithdrwal);
export default router;