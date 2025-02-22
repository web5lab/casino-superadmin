import mongoose from 'mongoose';

const currencySchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  enabled: {
    type: Boolean,
    default: true
  },
  exchangeRate: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Currency', currencySchema);