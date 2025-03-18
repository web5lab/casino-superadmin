import axios from "axios";
import Casino from "../models/Casino.Schema.js";
import CasinoUser from "../models/CasinoUser.Schema.js";
import UserTransaction from "../models/transactions.Schema.js";
import WithdrawalRequest from "../models/Withdrawl.Schema.js";
import { getERC20Balance } from "../services/balance.services.js";
import { getWallet } from "../services/wallet.services.js";
import Transaction from "../models/Transaction.Schema.js";

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
        const { userId, amount, wallet, casinoId, currency } = req.body;
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