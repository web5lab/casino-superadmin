import mongoose from 'mongoose';

const casinoUserSchema = new mongoose.Schema({
    casinoUniqueId: {
        type: String,
        required: true,
        unique: true
    },
    casinoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Casino',
        required: true
    },
}, { timestamps: true });

export default mongoose.model('CasinoUser', casinoUserSchema);

