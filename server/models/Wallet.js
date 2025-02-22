import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  network: {
    type: String,
    required: true,
    enum: ['ethereum', 'solana', 'bitcoin']
  },
  type: {
    type: String,
    required: true,
    enum: ['adminWallet', 'fundingWallet']
  },
  address: {
    type: String,
    required: true
  },
  encryptedPrivateKey: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    default: 0
  },
  extraInfo: {
    type: Map,
    of: new mongoose.Schema({
      amount: Number,
      color: String
    }, { _id: false })
  }
}, {
  timestamps: true
});

export default mongoose.model('Wallet', walletSchema);