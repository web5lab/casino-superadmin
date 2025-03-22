import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CasinoUser',
    required: true
  },
  casinoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Casino',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  currency: {
    type: String,
    default: 'USDT',
  },
  wallet: {
    type: String,
    default: '',
  },
  transactionHash: {
    type: String,
    default: '',
  },
  network: {
    type: String,
    default: 'amoyTestnet',
  }
}, {
  timestamps: true
});

export default mongoose.model('Deposites', transactionSchema);