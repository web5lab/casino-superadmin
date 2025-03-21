import axios from 'axios';
import * as ethers from 'ethers';

// Standard ERC20 ABI for the balanceOf function
const ERC20_ABI = [
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
  }
];

// RPC URLs for different networks
const RPC_URLS = {
  ethereum: 'https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY',
  bsc: 'https://bsc-dataseed.binance.org',
  polygon: 'https://polygon-rpc.com',
  arbitrum: 'https://arb1.arbitrum.io/rpc',
  optimism: 'https://mainnet.optimism.io',
  avalanche: 'https://api.avax.network/ext/bc/C/rpc',
  amoyTestnet:"https://polygon-amoy-bor-rpc.publicnode.com"
};

// API keys for various services (replace with your own)
const API_KEYS = {
  blockstream: '', // No API key required for Blockstream
  etherscan: 'YOUR_ETHERSCAN_API_KEY',
  bscscan: 'YOUR_BSCSCAN_API_KEY',
  polygonscan: 'YOUR_POLYGONSCAN_API_KEY'
};

/**
 * Get BTC balance for a Bitcoin address
 * @param {string} address - Bitcoin address
 * @param {boolean} testnet - Whether to use testnet or mainnet
 * @returns {Promise<Object>} Bitcoin balance information
 */
async function getBitcoinBalance(address, testnet = false) {
  try {
    const network = testnet ? 'testnet' : 'mainnet';
    const url = `https://blockstream.info/${testnet ? 'testnet/' : ''}api/address/${address}`;
    
    const response = await axios.get(url);
    const satoshiBalance = response.data.chain_stats.funded_txo_sum - response.data.chain_stats.spent_txo_sum;
    const btcBalance = satoshiBalance / 100000000; // Convert satoshis to BTC
    
    return {
      address,
      network,
      balanceSatoshi: satoshiBalance,
      balanceBTC: btcBalance,
      transactions: response.data.chain_stats.tx_count
    };
  } catch (error) {
    console.error(`Error fetching Bitcoin balance: ${error.message}`);
    throw new Error(`Failed to get Bitcoin balance: ${error.message}`);
  }
}

/**
 * Get native token balance for an EVM address (ETH, BNB, MATIC, etc.)
 * @param {string} address - EVM wallet address
 * @param {string} network - Network name (ethereum, bsc, polygon, etc.)
 * @returns {Promise<Object>} Native token balance information
 */
async function getEVMNativeBalance(address, network = 'ethereum') {
  try {
    if (!RPC_URLS[network]) {
      throw new Error(`Unsupported network: ${network}`);
    }
    
    const provider = new ethers.JsonRpcProvider(RPC_URLS[network]);
    const balance = await provider.getBalance(address);
    const balanceInEther = ethers.formatEther(balance);
    
    // Map network to token symbol
    const tokenSymbols = {
      ethereum: 'ETH',
      bsc: 'BNB',
      polygon: 'MATIC',
      arbitrum: 'ETH',
      optimism: 'ETH',
      avalanche: 'AVAX'
    };
    
    return {
      address,
      network,
      balanceWei: balance.toString(),
      balanceFormatted: balanceInEther,
      tokenSymbol: tokenSymbols[network] || 'Unknown'
    };
  } catch (error) {
    console.error(`Error fetching ${network} native balance: ${error.message}`);
    throw new Error(`Failed to get ${network} balance: ${error.message}`);
  }
}

/**
 * Get ERC20 token balance for an address
 * @param {string} address - EVM wallet address
 * @param {string} tokenAddress - Contract address of the ERC20 token
 * @param {string} network - Network name (ethereum, bsc, polygon, etc.)
 * @returns {Promise<Object>} Token balance information
 */
async function getERC20Balance(address, tokenAddress, network = 'ethereum') {
  try {
    if (!RPC_URLS[network]) {
      throw new Error(`Unsupported network: ${network}`);
    }
    
    const provider = new ethers.JsonRpcProvider(RPC_URLS[network]);
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    
    // Get token details and balance in parallel
    const [balance, decimals, symbol] = await Promise.all([
      tokenContract.balanceOf(address),
      tokenContract.decimals(),
      tokenContract.symbol()
    ]);
    
    const formattedBalance = ethers.formatUnits(balance, decimals);
    
    return {
      address,
      tokenAddress,
      network,
      tokenSymbol: symbol,
      balanceRaw: balance.toString(),
      balanceFormatted: formattedBalance,
      decimals
    };
  } catch (error) {
    console.error(`Error fetching ERC20 balance: ${error.message}`);
    throw new Error(`Failed to get ERC20 token balance: ${error.message}`);
  }
}

/**
 * Get all ERC20 token balances for an address using Etherscan API
 * @param {string} address - EVM wallet address
 * @param {string} network - Network name (ethereum, bsc, polygon)
 * @returns {Promise<Array>} List of token balances
 */
async function getAllERC20Balances(address, network = 'ethereum') {
  try {
    // Map network to API endpoint
    const apiEndpoints = {
      ethereum: `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&sort=desc&apikey=${API_KEYS.etherscan}`,
      bsc: `https://api.bscscan.com/api?module=account&action=tokentx&address=${address}&sort=desc&apikey=${API_KEYS.bscscan}`,
      polygon: `https://api.polygonscan.com/api?module=account&action=tokentx&address=${address}&sort=desc&apikey=${API_KEYS.polygonscan}`
    };
    
    if (!apiEndpoints[network]) {
      throw new Error(`Unsupported network for token scanning: ${network}`);
    }
    
    const response = await axios.get(apiEndpoints[network]);
    
    if (response.data.status !== '1') {
      throw new Error(`API Error: ${response.data.message}`);
    }
    
    // Extract unique token addresses
    const tokenAddresses = [...new Set(
      response.data.result
        .filter(tx => tx.to.toLowerCase() === address.toLowerCase() || 
                      tx.from.toLowerCase() === address.toLowerCase())
        .map(tx => tx.contractAddress)
    )];
    
    // Get balance for each token
    const balances = await Promise.all(
      tokenAddresses.map(async (tokenAddress) => {
        try {
          return await getERC20Balance(address, tokenAddress, network);
        } catch (err) {
          console.warn(`Could not fetch balance for token ${tokenAddress}: ${err.message}`);
          return null;
        }
      })
    );
    
    // Filter out failed balance checks and tokens with zero balance
    return balances
      .filter(balance => balance !== null && 
              parseFloat(balance.balanceFormatted) > 0)
      .sort((a, b) => parseFloat(b.balanceFormatted) - parseFloat(a.balanceFormatted));
  } catch (error) {
    console.error(`Error fetching all ERC20 balances: ${error.message}`);
    throw new Error(`Failed to get all ERC20 token balances: ${error.message}`);
  }
}

/**
 * Get comprehensive balance information for a user
 * @param {Object} walletInfo - Object containing wallet addresses
 * @param {Array<string>} networks - List of networks to check
 * @returns {Promise<Object>} Complete balance information across chains
 */
async function getCompleteBalances(walletInfo, networks = ['ethereum', 'bsc', 'polygon']) {
  try {
    const result = {
      btcBalance: null,
      evmBalances: {},
      erc20Balances: {},
      timestamp: new Date().toISOString()
    };
    
    // Get Bitcoin balance if address is provided
    if (walletInfo.btcAddress) {
      result.btcBalance = await getBitcoinBalance(walletInfo.btcAddress, walletInfo.btcTestnet);
    }
    
    // Get EVM native balances
    if (walletInfo.ethAddress) {
      const evmPromises = networks.map(network => 
        getEVMNativeBalance(walletInfo.ethAddress, network)
          .catch(err => ({
            network,
            error: err.message,
            balanceFormatted: '0'
          }))
      );
      
      const evmResults = await Promise.all(evmPromises);
      evmResults.forEach(balance => {
        result.evmBalances[balance.network] = balance;
      });
      
      // Get ERC20 token balances
      const erc20Promises = networks.map(network => 
        getAllERC20Balances(walletInfo.ethAddress, network)
          .catch(err => ({
            network,
            error: err.message,
            tokens: []
          }))
      );
      
      const erc20Results = await Promise.all(erc20Promises);
      erc20Results.forEach((tokenList, index) => {
        const network = networks[index];
        result.erc20Balances[network] = tokenList;
      });
    }
    
    return result;
  } catch (error) {
    console.error(`Error getting complete balances: ${error.message}`);
    throw new Error(`Failed to get complete balance information: ${error.message}`);
  }
}

/**
 * Transfer ERC20 tokens from one wallet to another
 * @param {string} privateKey - Private key of the sender's wallet
 * @param {string} tokenAddress - Contract address of the ERC20 token
 * @param {string} recipientAddress - Recipient wallet address
 * @param {string|number} amount - Amount of tokens to send (in token units, not wei)
 * @param {string} network - Network name (ethereum, bsc, polygon, etc.)
 * @param {Object} options - Additional options like gas price, gas limit
 * @returns {Promise<Object>} Transaction receipt
 */
async function transferERC20Tokens(privateKey, tokenAddress, recipientAddress, amount, network = 'ethereum', options = {}) {
  try {
    if (!RPC_URLS[network]) {
      throw new Error(`Unsupported network: ${network}`);
    }
    
    // Connect to the network with the private key
    const provider = new ethers.JsonRpcProvider(RPC_URLS[network]);
    const wallet = new ethers.Wallet(privateKey, provider);
    
    // Get the token contract interface
    const tokenContract = new ethers.Contract(tokenAddress, [
      ...ERC20_ABI,
      {
        "constant": false,
        "inputs": [
          {"name": "_to", "type": "address"},
          {"name": "_value", "type": "uint256"}
        ],
        "name": "transfer",
        "outputs": [{"name": "success", "type": "bool"}],
        "type": "function"
      }
    ], wallet);
    
    // Get token decimals to format the amount correctly
    const decimals = await tokenContract.decimals();
    
    // Format amount with the correct number of decimals
    const amountInWei = ethers.parseUnits(amount.toString(), decimals);
    
    // Check if the sender has sufficient balance
    const senderAddress = wallet.address;
    const balance = await tokenContract.balanceOf(senderAddress);
    
    if (balance < amountInWei) {
      throw new Error(`Insufficient token balance. Available: ${ethers.formatUnits(balance, decimals)}`);
    }
    
    // Prepare transaction options
    const txOptions = {};
    
    if (options.gasLimit) {
      txOptions.gasLimit = ethers.getBigInt(options.gasLimit);
    }
    
    if (options.gasPrice) {
      txOptions.gasPrice = ethers.parseUnits(options.gasPrice.toString(), 'gwei');
    } else {
      // For networks that use EIP-1559, we can use maxFeePerGas and maxPriorityFeePerGas
      if (network === 'ethereum' || network === 'polygon' || network === 'arbitrum' || network === 'optimism') {
        const feeData = await provider.getFeeData();
        if (feeData.maxFeePerGas && feeData.maxPriorityFeePerGas) {
          txOptions.maxFeePerGas = feeData.maxFeePerGas;
          txOptions.maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
        }
      }
    }
    
    // Send the transaction
    const tx = await tokenContract.transfer(recipientAddress, amountInWei, txOptions);
    
    // Get transaction receipt
    const receipt = await tx.wait();
    
    // Format the response
    return {
      tokenAddress,
      senderAddress,
      recipientAddress,
      amount: amount.toString(),
      amountInWei: amountInWei.toString(),
      network,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      status: receipt.status === 1 ? 'success' : 'failed',
      gasUsed: receipt.gasUsed.toString(),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error transferring ERC20 tokens: ${error.message}`);
    throw new Error(`Failed to transfer tokens: ${error.message}`);
  }
}

/**
 * Transfer ERC20 tokens with sponsored gas
 * @param {string} sponsorPrivateKey - Private key of the sponsor wallet
 * @param {string} senderPrivateKey - Private key of the sender wallet
 * @param {string} tokenAddress - Contract address of the ERC20 token
 * @param {string} recipientAddress - Recipient wallet address
 * @param {string|number} amount - Amount of tokens to send (in token units, not wei)
 * @param {string} network - Network name (ethereum, bsc, polygon, etc.)
 * @param {Object} options - Additional options like gas price, gas limit
 * @returns {Promise<Object>} Transaction receipt
 */
async function sponsoredTransferERC20({
  sponsorPrivateKey, 
  senderPrivateKey, 
  tokenAddress, 
  recipientAddress, 
  amount, 
  network = 'amoyTestnet', 
  options = {}}
) {
  try {
    if (!RPC_URLS[network]) {
      throw new Error(`Unsupported network: ${network}`);
    }

    // Validate addresses
    if (!ethers.isAddress(tokenAddress)) {
      throw new Error(`Invalid token address: ${tokenAddress}`);
    }
    
    console.log("recpients: " + JSON.stringify(recipientAddress));
    if (!recipientAddress || !ethers.isAddress(recipientAddress)) {
      throw new Error(`Invalid recipient address: ${recipientAddress}`);
    }

    const provider = new ethers.JsonRpcProvider(RPC_URLS[network]);

    // Create sponsor and sender wallets
    const sponsorWallet = new ethers.Wallet(sponsorPrivateKey, provider);
    const senderWallet = new ethers.Wallet(senderPrivateKey, provider);
    
    console.log(`Sender address: ${senderWallet.address}`);
    console.log(`Recipient address: ${recipientAddress}`);
    console.log(`Token address: ${tokenAddress}`);

    // Define minimal ERC20 ABI using standard ethers.js format
    const minimalErc20Abi = [
      "function balanceOf(address) view returns (uint256)",
      "function decimals() view returns (uint8)",
      "function transfer(address, uint256) returns (bool)"
    ];

    // Get the token contract interface
    const tokenContract = new ethers.Contract(tokenAddress, minimalErc20Abi, senderWallet);

    // Get token decimals and format amount
    let decimals;
    try {
      decimals = await tokenContract.decimals();
      console.log(`Token decimals: ${decimals}`);
    } catch (error) {
      console.log("Error getting decimals, defaulting to 18");
      decimals = 18;
    }

    const amountStr = String(amount).replace(',', '.');
    const amountInWei = ethers.parseUnits(amountStr, decimals);
    console.log(`Amount in wei: ${amountInWei}`);

    // Check balance
    const senderBalance = await tokenContract.balanceOf(senderWallet.address);
    console.log(`Sender balance: ${senderBalance}`);
    
    if (senderBalance < amountInWei) {
      throw new Error(`Insufficient token balance. Available: ${ethers.formatUnits(senderBalance, decimals)}`);
    }

    // Get fee data
    const feeData = await provider.getFeeData();
    const gasLimit = options.gasLimit ? ethers.getBigInt(options.gasLimit) : ethers.getBigInt(150000);
    
    let gasPrice;
    if (options.gasPrice) {
      gasPrice = ethers.parseUnits(options.gasPrice.toString(), 'gwei');
    } else {
      gasPrice = feeData.gasPrice;
    }
    
    if (!gasPrice) {
      throw new Error("Failed to get gas price");
    }

    // Calculate gas cost
    const gasCost = gasPrice * gasLimit;
    console.log(`Estimated Gas Cost: ${ethers.formatEther(gasCost)} ETH`);

    // Check sponsor balance
    const sponsorBalance = await provider.getBalance(sponsorWallet.address);
    if (sponsorBalance < gasCost) {
      throw new Error(`Insufficient balance in sponsor's wallet for gas.`);
    }

    // Send gas from sponsor to sender
    const sponsorTx = await sponsorWallet.sendTransaction({
      to: senderWallet.address,
      value: gasCost
    });

    console.log(`Gas sponsorship transaction sent: ${sponsorTx.hash}`);
    await sponsorTx.wait();

    // Send the token transfer
    console.log(`Sending ${amountStr} tokens to ${recipientAddress}...`);
    
    const tx = await tokenContract.transfer(recipientAddress, amountInWei, {
      gasLimit,
      gasPrice
    });
    
    console.log(`Transaction sent: ${tx.hash}`);
    const receipt = await tx.wait();

    console.log(`Token transfer transaction hash: ${receipt.hash}`);

    // Return the transaction details
    return {
      tokenAddress,
      senderAddress: senderWallet.address,
      sponsorAddress: sponsorWallet.address,
      recipientAddress,
      amount: amountStr,
      amountInWei: amountInWei.toString(),
      network,
      sponsorTxHash: sponsorTx.hash,
      transferTxHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      status: receipt.status === 1 ? 'success' : 'failed',
      gasUsed: receipt.gasUsed.toString(),
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error(`Error in sponsored transfer: ${error.message}`);
    throw new Error(`Failed to perform sponsored transfer: ${error.message}`);
  }
}

export {
  getBitcoinBalance,
  getEVMNativeBalance,
  getERC20Balance,
  getAllERC20Balances,
  getCompleteBalances,
  transferERC20Tokens,
  sponsoredTransferERC20
};