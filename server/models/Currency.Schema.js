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
  icon: {
    type: String,
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
  },
  network: [{
    id: { type: String, default: "" },
    name: { type: String, default: "" },
  }]
}, {
  timestamps: true
});

export default mongoose.model('Currency', currencySchema);