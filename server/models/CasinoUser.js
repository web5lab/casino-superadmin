import mongoose from 'mongoose';

const casinoUserSchema = new mongoose.Schema({
    casinoUniqueId: {
        type: String,
        required: true,
        index: true
    },
    casinoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Casino',
        required: true,
        index: true
    },
    wallet: [{
        walletType: {
            type: String,
            required: true
        },
        walletAddress: {
            type: String,
            required: true
        },
        balance: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            required: true
        }
    }],
    transactions: [{
        hash: {
            type: String,
            required: true
        }, amount: {
            type: Number,
            required: true
        }, status: {
            type: String,
            required: true
        }, walletAddress: {
            type: String,
            required: true
        }, networkId: {
            type: Number,
        }
    }]
    ,
}, { timestamps: true });

export default mongoose.model('CasinoUser', casinoUserSchema);