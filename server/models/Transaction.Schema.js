import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  casinoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Casino',
    required: true
  },
  walletAddress: {
    type: String,
    required: true
  },
  network: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Deposites', transactionSchema);