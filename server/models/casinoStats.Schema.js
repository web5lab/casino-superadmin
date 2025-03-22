import mongoose from 'mongoose';

const casinoStatsSchema = new mongoose.Schema({
    casinoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Casino',
        required: true,
        index: true
    },
    totalUsers: {
        type: Number,
        default: 0
    },
    totalVolumes: {
        type: Number,
        default: 0
    },
    totalDeposites: {
        type: Number,
        default: 0
    },
    totalWithdrawals: {
        type: Number,
        default: 0
    },
    currencyVolume:
        [{
            currencyName: {
                type: String,
                required: true
            }, volume: {
                type: Number,
                required: true
            }
        }],
    pendingWithdrawals: {
        type: Number,
        default: 0
    },
    approvedWithdrawals: {
        type: Number,
        default: 0
    },
    rejectedWithdrawals: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true
});


export default mongoose.model('CasinoStats', casinoStatsSchema);