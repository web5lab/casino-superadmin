import mongoose from 'mongoose';

const networkSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  rpcUrl: {
    type: String,
    required: true
  },
    enabled: {
        type: Boolean,
        default: true
    },
    explorerUrl: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    }
}, {
  timestamps: true
});

export default mongoose.model('networks', networkSchema);