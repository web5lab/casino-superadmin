import Web3 from 'web3';
import BN from 'bn.js';

const web3 = new Web3(process.env.ETH_RPC_URL);

export const ethereumUtils = {
  async getBalance(address) {
    try {
      const balance = await web3.eth.getBalance(address);
      // Use BN for precise calculations
      const wei = new BN(balance);
      const decimals = new BN(10).pow(new BN(18));
      return wei.div(decimals).toString();
    } catch (error) {
      console.error('ETH balance check failed:', error);
      throw error;
    }
  },

  async getTransactions(address, fromBlock = 'latest') {
    try {
      const transactions = await web3.eth.getPastLogs({
        fromBlock,
        toBlock: 'latest',
        address
      });
      return transactions;
    } catch (error) {
      console.error('ETH transaction check failed:', error);
      throw error;
    }
  },

  validateAddress(address) {
    return web3.utils.isAddress(address);
  },

  async estimateGas(transaction) {
    try {
      return await web3.eth.estimateGas(transaction);
    } catch (error) {
      console.error('ETH gas estimation failed:', error);
      throw error;
    }
  }
};