import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import BN from 'bn.js';

const connection = new Connection(
  process.env.SOLANA_RPC_URL || clusterApiUrl('devnet'),
  'confirmed'
);

export const solanaUtils = {
  async getBalance(address) {
    try {
      const publicKey = new PublicKey(address);
      const balance = await connection.getBalance(publicKey);
      // Use BN for precise calculations
      const lamports = new BN(balance);
      const decimals = new BN(10).pow(new BN(9));
      return lamports.div(decimals).toString(); // Convert lamports to SOL
    } catch (error) {
      console.error('Solana balance check failed:', error);
      throw error;
    }
  },

  async getTransactions(address) {
    try {
      const publicKey = new PublicKey(address);
      const signatures = await connection.getSignaturesForAddress(publicKey);
      const transactions = await Promise.all(
        signatures.map(sig => connection.getTransaction(sig.signature))
      );
      return transactions;
    } catch (error) {
      console.error('Solana transaction check failed:', error);
      throw error;
    }
  },

  validateAddress(address) {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  }
};