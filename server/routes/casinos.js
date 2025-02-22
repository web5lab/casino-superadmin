import express from 'express';
import { body, validationResult } from 'express-validator';
import { auth, requireRole } from '../middleware/auth.js';
import Casino from '../models/Casino.js';

const router = express.Router();

// Get all casinos
router.get('/', auth, async (req, res) => {
  try {
    const casinos = await Casino.find();
    res.json(casinos);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get casino by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const casino = await Casino.findById(req.params.id);
    if (!casino) {
      return res.status(404).json({ message: 'Casino not found' });
    }
    res.json(casino);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new casino
router.post('/', [
  auth,
  requireRole(['SUPER_ADMIN']),
  body('name').notEmpty(),
  body('apiConfig').isObject(),
  body('theme').isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const casino = new Casino(req.body);
    await casino.save();
    res.status(201).json(casino);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update casino
router.put('/:id', [
  auth,
  requireRole(['SUPER_ADMIN']),
  body('name').optional().notEmpty(),
  body('status').optional().isIn(['active', 'inactive']),
  body('apiConfig').optional().isObject(),
  body('theme').optional().isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const casino = await Casino.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!casino) {
      return res.status(404).json({ message: 'Casino not found' });
    }

    res.json(casino);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete casino
router.delete('/:id', auth, requireRole(['SUPER_ADMIN']), async (req, res) => {
  try {
    const casino = await Casino.findByIdAndDelete(req.params.id);
    if (!casino) {
      return res.status(404).json({ message: 'Casino not found' });
    }
    res.json({ message: 'Casino deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;