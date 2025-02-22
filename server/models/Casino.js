import mongoose from 'mongoose';

const casinoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  balance: {
    type: Number,
    default: 0
  },
  transactions: {
    type: Number,
    default: 0
  },
  apiConfig: {
    balanceApi: String,
    depositApi: String,
    deductionApi: String,
    secretKey: String
  },
  theme: {
    primaryColor: String,
    secondaryColor: String,
    logo: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Casino', casinoSchema);