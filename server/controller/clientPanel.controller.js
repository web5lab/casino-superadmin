import WithdrawalRequest from "../models/Withdrawl.Schema.js";
import Transaction from "../models/Transaction.Schema.js";
import Casino from "../models/Casino.Schema.js";
import User from "../models/User.Schema.js";

export const userAllTransactions = async (req, res) => {
  try {
    const {
      casinoId,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      onlyWithdrawls = false,
      onlyDeposites = false
    } = req.body;

    if (!casinoId) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const skip = (page - 1) * limit;
    const sortDirection = sortOrder === "desc" ? -1 : 1;

    let transactions = [];

    if (onlyDeposites) {
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

      transactions = formattedDeposits;
      return res.status(200).json(transactions);
    }

    // If onlyWithdrawls is true, fetch only withdrawals
    if (onlyWithdrawls) {
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

      transactions = formattedWithdrawals;
    } else {
      // Fetch both deposits and withdrawals
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

      transactions = [...formattedDeposits, ...formattedWithdrawals]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit);
    }

    return res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, casinoId, permissions } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists." });
    }

    const newUser = new User({
      name,
      email,
      password,
      role,
      casinoId,
      permissions
    });

    await newUser.save();
    return res.status(201).json({ message: "User created successfully.", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getUsers = async (req, res) => {
  try {
    const { casinoId, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (casinoId) filter.casinoId = casinoId;

    const users = await User.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    const totalUsers = await User.countDocuments(filter);

    return res.status(200).json({
      users,
      total: totalUsers,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params; // User ID from URL params
    const { name, email, role, permissions, isActive } = req.body; // Fields to update

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (permissions) user.permissions = permissions;
    if (typeof isActive === 'boolean') user.isActive = isActive; // Soft deactivate/activate

    await user.save();

    return res.status(200).json({ message: "User updated successfully.", user });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCasinoSettings = async (req, res) => {
  try {
    const { casinoId } = req.params;
    const {
      name,
      status,
      apiConfig,
      theme,
      wallet,
      minimumWithdrawlAmount,
      maximumDailyWithdrawlAmount,
      autoWithdrawl,
      autoWithdrawlAmount,
      masterPhrase
    } = req.body;

    if (!casinoId) {
      return res.status(400).json({ message: "Casino ID is required." });
    }

    const casino = await Casino.findById(casinoId).select("-masterPhrase");
    if (!casino) {
      return res.status(404).json({ message: "Casino not found." });
    }

    // Field-by-field update using if conditions
    if (name) casino.name = name;
    if (status) casino.status = status;
    if (apiConfig) casino.apiConfig = apiConfig;
    if (theme) casino.theme = theme;
    if (wallet) casino.wallet = wallet;
    if (typeof minimumWithdrawlAmount === 'number') casino.minimumWithdrawlAmount = minimumWithdrawlAmount;
    if (typeof maximumDailyWithdrawlAmount === 'number') casino.maximumDailyWithdrawlAmount = maximumDailyWithdrawlAmount;
    if (typeof autoWithdrawl === 'boolean') casino.autoWithdrawl = autoWithdrawl;
    if (typeof autoWithdrawlAmount === 'number') casino.autoWithdrawlAmount = autoWithdrawlAmount;
    if (masterPhrase) casino.masterPhrase = masterPhrase;

    await casino.save();

    return res.status(200).json({ message: "Casino settings updated successfully.", casino });
  } catch (error) {
    console.error("Error updating casino settings:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCasinoSettings = async (req, res) => {
  try {
    const { casinoId } = req.params;

    if (!casinoId) {
      return res.status(400).json({ message: "Casino ID is required." });
    }

    const casino = await Casino.findById(casinoId).select("-masterPhrase").lean().exec();
    if (!casino) {
      return res.status(404).json({ message: "Casino not found." });
    }

    return res.status(200).json({ casino });
  } catch (error) {
    console.error("Error fetching casino settings:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};