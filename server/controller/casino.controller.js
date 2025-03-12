import CasinoUser from "../models/CasinoUser.js";
import UserTransaction from "../models/transactions.Schema.js";
import WithdrawalRequest from "../models/Withdrawl.Schema.js";

export const userTransaction = async (req, res) => {
    try {
        const { userId, transactionType, amount } = req.body;
        if (!userId || !transactionType || !amount) {
            return res.status(400).json({ message: "Invalid request" });
        }

        const user = await CasinoUser.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const transaction = new UserTransaction({
            userId,
            transactionType,
            amount
        });
        await transaction.save();

        user.transactions.push(transaction._id);
        await user.save();

        return res.status(200).json(transaction);
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const requestWithdrwal = async (req, res) => {
    try {
        const { userId, amount } = req.body;
        if (!userId || !amount) {
            return res.status(400).json({ message: "Invalid request" });
        }

        const user = await CasinoUser.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const withdrawalRequest = new WithdrawalRequest({
            userId,
            amount
        });
        await withdrawalRequest.save();

        user.withdrawalRequests.push(withdrawalRequest._id);
        await user.save();

        return res.status(200).json(withdrawalRequest);
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getUserWallet = async (req, res) => {
    try {
        const { userId, platformId } = req.query;
        if (!userId || !platformId) {
            return res.status(400).json({ message: "Invalid request" });
        }

        let user = await CasinoUser.findOne({ casinoUniqueId: userId, casinoId: platformId });

        if (!user) {
            user = new CasinoUser({
                casinoUniqueId: userId,
                casinoId: platformId,
                address: [],
                transactions: []
            });
            await user.save();
        }

        return res.status(200).json(user);
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const refreshWallet = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: "Invalid request" });
        }

        const user = await CasinoUser.findById(userId).populate('transactions').populate('withdrawalRequests');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.log("error", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};