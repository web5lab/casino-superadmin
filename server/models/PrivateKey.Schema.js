import mongoose from 'mongoose';

const privateKeySchema = new mongoose.Schema({
  address: {
    type: String,
    unique: true,
    indexed: true,
  }, privateKey: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

export default mongoose.model('PrivateKeys', privateKeySchema);