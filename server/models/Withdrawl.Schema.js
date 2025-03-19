import mongoose from 'mongoose';

const withdrawalRequestSchema = new mongoose.Schema({
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
        enum: ['pending', 'approved', 'rejected'],
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
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('WithdrawalRequests', withdrawalRequestSchema);