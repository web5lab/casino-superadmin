import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  network: {
    type: String,
    required: true,
    enum: ['ethereum', 'tron', 'bitcoin', 'solana']
  },
  type: {
    type: String,
    required: true,
    enum: ['adminWallet', 'fundingWallet', 'userWallet']
  },
  address: {
    type: String,
    required: true
  },
  encryptedPrivateKey: {
    type: String,
    required: true
  },
  Currency: {
    id: { type: String },
    balance: { type: String},
    network: { type: String }
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