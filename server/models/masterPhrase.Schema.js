import mongoose from 'mongoose';

const masterPhraseSchema = new mongoose.Schema({
    casinoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Casino',
        required: true
    },
    masterPhrase: {
        type: Number,
        required: true
    },
    evmWallet: {
        type: String,
        required: true
    },
    evmWalletPrivateKey: {
        type: String,
        required: true
    },
    fundingEvmWallet: {
        type: String,
        required: true
    },
    fundingEvmWalletPrivateKey: {
        type: String,
        required: true
    },

}, { timestamps: true });

export default mongoose.model('masterPhrase', masterPhraseSchema);