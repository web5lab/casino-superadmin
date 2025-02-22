import { ethereumUtils } from './ethereum.js';
import { solanaUtils } from './solana.js';
import { bitcoinUtils } from './bitcoin.js';
import * as walletGen from './walletGenerator.js';
import { keystore } from './keystore.js';

export const blockchainUtils = {
  ethereum: ethereumUtils,
  solana: solanaUtils,
  bitcoin: bitcoinUtils,

  getUtilsByNetwork(network) {
    const utils = {
      ethereum: ethereumUtils,
      solana: solanaUtils,
      bitcoin: bitcoinUtils
    };
    return utils[network.toLowerCase()];
  }
};

export const walletGenerator = walletGen.walletGenerator;
export const validatePrivateKey = walletGen.validatePrivateKey;
export { keystore };

export const monitorAddress = async (network, address, callback) => {
    const utils = blockchainUtils.getUtilsByNetwork(network);
    if (!utils) {
      throw new Error(`Unsupported network: ${network}`);
    }

    let lastKnownBalance = await utils.getBalance(address);
    
    // Check every minute
    setInterval(async () => {
      try {
        const currentBalance = await utils.getBalance(address);
        if (currentBalance !== lastKnownBalance) {
          const transactions = await utils.getTransactions(address);
          callback({
            network,
            address,
            previousBalance: lastKnownBalance,
            currentBalance,
            transactions
          });
          lastKnownBalance = currentBalance;
        }
      } catch (error) {
        console.error(`Monitoring error for ${network}:${address}:`, error);
      }
    }, 60000);
}