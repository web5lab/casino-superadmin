import * as bitcoin from 'bitcoinjs-lib';
import { Keypair } from '@solana/web3.js';
import Web3 from 'web3';
import crypto from 'crypto';

export const walletGenerator = {
  ethereum: {
    generateWallet() {
      const web3 = new Web3();
      const account = web3.eth.accounts.create();
      return {
        address: account.address,
        privateKey: account.privateKey,
        type: 'ethereum'
      };
    },

    generateHDWallet(mnemonic) {
      const web3 = new Web3();
      const account = web3.eth.accounts.privateKeyToAccount(
        web3.utils.sha3(mnemonic)
      );
      return {
        address: account.address,
        privateKey: account.privateKey,
        mnemonic,
        type: 'ethereum'
      };
    }
  },

  solana: {
    generateWallet() {
      const keypair = Keypair.generate();
      return {
        address: keypair.publicKey.toString(),
        privateKey: Buffer.from(keypair.secretKey).toString('hex'),
        type: 'solana'
      };
    },

    generateHDWallet(seed) {
      const keypair = Keypair.fromSeed(
        Buffer.from(seed.slice(0, 32))
      );
      return {
        address: keypair.publicKey.toString(),
        privateKey: Buffer.from(keypair.secretKey).toString('hex'),
        seed,
        type: 'solana'
      };
    }
  },

  bitcoin: {
    generateWallet(network = 'testnet') {
      const networkConfig = network === 'mainnet' 
        ? bitcoin.networks.bitcoin 
        : bitcoin.networks.testnet;
      
      const keyPair = bitcoin.ECPair.makeRandom({ network: networkConfig });
      const { address } = bitcoin.payments.p2pkh({
        pubkey: keyPair.publicKey,
        network: networkConfig
      });

      return {
        address,
        privateKey: keyPair.toWIF(),
        type: 'bitcoin',
        network
      };
    },

    generateHDWallet(mnemonic, network = 'testnet') {
      const seed = crypto.createHash('sha256').update(mnemonic).digest();
      const keyPair = bitcoin.ECPair.fromPrivateKey(seed, {
        network: network === 'mainnet' ? bitcoin.networks.bitcoin : bitcoin.networks.testnet
      });
      const { address } = bitcoin.payments.p2pkh({
        pubkey: keyPair.publicKey,
        network: network === 'mainnet' ? bitcoin.networks.bitcoin : bitcoin.networks.testnet
      });

      return {
        address,
        privateKey: keyPair.toWIF(),
        mnemonic,
        type: 'bitcoin',
        network
      };
    }
  }
};

export const validatePrivateKey = {
  ethereum(privateKey) {
    try {
      const web3 = new Web3();
      const account = web3.eth.accounts.privateKeyToAccount(privateKey);
      return !!account.address;
    } catch {
      return false;
    }
  },

  solana(privateKey) {
    try {
      const secretKey = Buffer.from(privateKey, 'hex');
      Keypair.fromSecretKey(secretKey);
      return true;
    } catch {
      return false;
    }
  },

  bitcoin(wif, network = 'testnet') {
    try {
      bitcoin.ECPair.fromWIF(
        wif,
        network === 'mainnet' ? bitcoin.networks.bitcoin : bitcoin.networks.testnet
      );
      return true;
    } catch {
      return false;
    }
  }
};