import * as bitcoin from 'bitcoinjs-lib';
import BN from 'bn.js';

const network = bitcoin.networks.testnet;

export const bitcoinUtils = {
  validateAddress(address) {
    try {
      bitcoin.address.toOutputScript(address, network);
      return true;
    } catch {
      return false;
    }
  },

  async getBalance(address) {
    try {
      const response = await fetch(
        `${process.env.BTC_API_URL}/address/${address}/balance`
      );
      const data = await response.json();
      // Use BN for precise calculations
      const balance = new BN(data.balance);
      const decimals = new BN(10).pow(new BN(8));
      return balance.div(decimals).toString(); // Convert satoshis to BTC
    } catch (error) {
      console.error('BTC balance check failed:', error);
      throw error;
    }
  },

  async getTransactions(address) {
    try {
      const response = await fetch(
        `${process.env.BTC_API_URL}/address/${address}/txs`
      );
      return await response.json();
    } catch (error) {
      console.error('BTC transaction check failed:', error);
      throw error;
    }
  }
};