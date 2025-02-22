import TronWeb from 'tronweb';

const tronWeb = new TronWeb({
  fullHost: process.env.TRON_RPC_URL || 'https://api.shasta.trongrid.io',
  headers: { "TRON-PRO-API-KEY": process.env.TRON_API_KEY }
});

export const tronUtils = {
  async getBalance(address) {
    try {
      const balance = await tronWeb.trx.getBalance(address);
      return balance / 1e6; // Convert sun to TRX
    } catch (error) {
      console.error('TRON balance check failed:', error);
      throw error;
    }
  },

  async getTransactions(address) {
    try {
      const transactions = await tronWeb.trx.getTransactionsRelated(address);
      return transactions.data;
    } catch (error) {
      console.error('TRON transaction check failed:', error);
      throw error;
    }
  },

  validateAddress(address) {
    return tronWeb.isAddress(address);
  }
};