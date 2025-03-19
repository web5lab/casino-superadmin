import axios from "axios";
import Casino from "../models/Casino.Schema.js";
import CasinoUser from "../models/CasinoUser.Schema.js";
import WithdrawalRequest from "../models/Withdrawl.Schema.js";
import { getERC20Balance, transferERC20Tokens } from "../services/balance.services.js";
import { getWallet } from "../services/wallet.services.js";
import Transaction from "../models/Transaction.Schema.js";

// API: Get Withdrawals
export const getWithdrawals = async (req, res) => {
    try {
        const { casinoId, page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" } = req.body;

        if (!casinoId) {
            return res.status(400).json({ message: "Invalid request" });
        }

        const skip = (page - 1) * limit;
        const sortDirection = sortOrder === "desc" ? -1 : 1;

        const withdrawals = await WithdrawalRequest
            .find({ casinoId })
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(limit)
            .lean()
            .exec();

        const formattedWithdrawals = withdrawals.map(tx => ({
            ...tx,
            type: "withdrawal"
        }));

        return res.status(200).json(formattedWithdrawals);
    } catch (error) {
        console.error("Error fetching withdrawals:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// API: Get Deposits
export const getDeposits = async (req, res) => {
    try {
        const { casinoId, page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" } = req.body;

        if (!casinoId) {
            return res.status(400).json({ message: "Invalid request" });
        }

        const skip = (page - 1) * limit;
        const sortDirection = sortOrder === "desc" ? -1 : 1;

        const deposits = await Transaction
            .find({ casinoId })
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(limit)
            .lean()
            .exec();

        const formattedDeposits = deposits.map(tx => ({
            ...tx,
            type: "deposit"
        }));

        return res.status(200).json(formattedDeposits);
    } catch (error) {
        console.error("Error fetching deposits:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// API: Get Combined Transactions (if needed)
export const userTransactions = async (req, res) => {
    try {
        const { casinoId, page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" } = req.body;

        if (!casinoId) {
            return res.status(400).json({ message: "Invalid request" });
        }

        const skip = (page - 1) * limit;
        const sortDirection = sortOrder === "desc" ? -1 : 1;

        const deposits = await Transaction
            .find({ casinoId })
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(limit)
            .lean()
            .exec();

        const withdrawals = await WithdrawalRequest
            .find({ casinoId })
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(limit)
            .lean()
            .exec();

        const formattedDeposits = deposits.map(tx => ({
            ...tx,
            type: "deposit"
        }));

        const formattedWithdrawals = withdrawals.map(tx => ({
            ...tx,
            type: "withdrawal"
        }));

        const transactions = [...formattedDeposits, ...formattedWithdrawals]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, limit);

        return res.status(200).json(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const requestWithdrwal = async (req, res) => {
    try {
        const { userId, amount, wallet, casinoId, currency } = req.body;
        if (!userId || !amount) {
            return res.status(400).json({ message: "Invalid request" });
        }
        const user = await CasinoUser.findOne({ casinoId: casinoId, casinoUniqueId: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const casinoConfig = await Casino.findById(casinoId);
        let transactionResponse
        if (!casinoConfig.autoWithdrawl) {
            transactionResponse = await transferERC20Tokens("34b7cd0c29091919040ed9b8cc4b24f53611ba3f2311ea5028c114af88bf2cba", "0x16B59e2d8274f2031c0eF4C9C460526Ada40BeDa", wallet, amount, "amoyTestnet");
        }
        const withdrawalRequest = new WithdrawalRequest({
            userId: user._id,
            casinoId: casinoId,
            amount,
            currency,
            wallet: wallet,
            transactionHash: transactionResponse?.transactionHash || ''
        });
        await withdrawalRequest.save();
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
            const wallet = await getWallet(userId)
            user = new CasinoUser({
                casinoUniqueId: userId,
                casinoId: platformId,
                address: [],
                transactions: []
            });
            const walletData = {
                walletType: 'evm',
                walletAddress: wallet.ethAddress,
                balance: 0,
                currency: 'USDT'
            }
            user.wallet.push(walletData);
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
        const { casinoUniqueId, casinoId } = req.body;

        if (!casinoUniqueId || !casinoId) {
            return res.status(400).json({ message: "Invalid request" });
        }

        const user = await CasinoUser.findOne({ casinoUniqueId, casinoId }).populate('transactions');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const casino = await Casino.findById(casinoId);
        if (!casino) {
            return res.status(404).json({ message: "Casino not found" });
        }

        for (let wallet of user.wallet) {
            if (wallet.walletType === "evm" && wallet.network === "amoy-testnet") {
                const { balanceFormatted } = await getERC20Balance(wallet.walletAddress, "0x16B59e2d8274f2031c0eF4C9C460526Ada40BeDa", "amoyTestnet");

                const currentBalance = Number(wallet.balance);
                const newBalance = Number(balanceFormatted);

                if (currentBalance !== newBalance) {
                    const balanceDiff = newBalance - currentBalance;

                    // Update user balance
                    wallet.balance = newBalance;

                    // Calculate deposit values
                    const valueInInr = 87 * balanceDiff;
                    const valueInUsdt = balanceDiff;

                    try {
                        const creditResponse = await axios.post(casino.apiConfig.depositApi, {
                            userId: Number(casinoUniqueId),
                            valueInInr,
                            valueInUsdt,
                        });

                        // Handle transaction success
                        if (creditResponse.status === 200) {
                            await new Transaction({
                                amount: balanceDiff,
                                currency: 'USDT',
                                status: 'completed',
                                casinoId,
                                walletAddress: wallet.walletAddress,
                                network: wallet.network
                            }).save();
                        } else {
                            // Handle failed transaction
                            await new Transaction({
                                amount: balanceDiff,
                                currency: 'USDT',
                                status: 'failed',
                                casinoId,
                                walletAddress: wallet.walletAddress,
                                network: wallet.network
                            }).save();
                        }
                    } catch (error) {
                        console.error("Transaction error:", error);

                        // Handle transaction error
                        await new Transaction({
                            amount: balanceDiff,
                            currency: 'USDT',
                            status: 'failed',
                            casinoId,
                            walletAddress: wallet.walletAddress,
                            network: wallet.network
                        }).save();;
                    }
                }
            }
        }

        await user.save();

        return res.status(200).json({ message: "Wallet refreshed successfully", user });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};