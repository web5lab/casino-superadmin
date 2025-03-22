import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['SUPER_ADMIN', 'PANEL_ADMIN'],
    default: 'PANEL_ADMIN'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  permissions: {
    type: [String],
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  casinoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Casino'
  },
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);