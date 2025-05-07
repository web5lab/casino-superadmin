import * as ethers from 'ethers';
import axiosInstance from '../axios/axiosInstance';
import axios from 'axios';
// Standard ERC20 ABI for the balanceOf function
const ERC20_ABI = [
  {
    "constant": true,
    "inputs": [{ "name": "_owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "balance", "type": "uint256" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{ "name": "", "type": "uint8" }],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{ "name": "", "type": "string" }],
    "type": "function"
  }
];

// RPC URLs for different networks
const RPC_URLS = {
  ethereum: 'https://ethereum-rpc.publicnode.com',
  bsc: 'https://bsc-dataseed.binance.org',
  polygon: 'https://polygon-rpc.com',
  arbitrum: 'https://arb1.arbitrum.io/rpc',
  optimism: 'https://mainnet.optimism.io',
  avalanche: 'https://api.avax.network/ext/bc/C/rpc',
  amoyTestnet: "https://polygon-amoy-bor-rpc.publicnode.com"
};
export async function getERC20Balance({ address, tokenAddress, network = 'amoyTestnet' }) {
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

export const getCasinoData = async (platformId) => {
  try {
    const response = await axiosInstance.get(`/api/casinos/casino/${platformId}`)
    return response.data;
  } catch (error) {
    console.log("error in get Casino", error);
  }
}

export const getBalance = async ({ apiUrl, secretKey, userId }) => {
  try {
    const response = await axios.post(apiUrl, {
      secretKey,
      userId
    })
    return response?.data?.balance;
  } catch (error) {
    console.log("error in get balance", error);
  }
}

export const GetUserEvmWallet = async ({ userId, platformId }) => {
  try {
    const Response = await axiosInstance.get(`/api/users/user-address?userId=${userId}&platformId=${platformId}`);
    return Response.data;
  } catch (err) {
    if (err) {
      throw err;
    }
  }
}

export const convertToCrypto = async ({ userId, amount, wallet, casinoId, currency , casinoCoinAmount  , secretKey  }) => {
  try {
    const response = await axiosInstance.post('/api/users/convert-to-crypto', {
      userId, amount, wallet, casinoId, currency , casinoCoinAmount  , secretKey
    })
    return response?.data;
  } catch (error) {
    console.log("error in get balance", error);
  }
}

export const convertToCasino = async ({ userId, amount, wallet, casinoId, secretKey  }) => {
  try {
    console.log("convertToCasino", secretKey);
    const response = await axiosInstance.post('/api/users/convert-to-casino', {
      userId, amount, wallet, casinoId, secretKey 
    })
    return response?.data;
  } catch (error) {
    console.log("error in get balance", error);
  }
}

export const withdrawCryptoToWallet = async ({  userId, amount, wallet, casinoId, currency, recipientAddress   }) => {
  try {
    const response = await axiosInstance.post('/api/users/request-withdrawl', {
      userId, amount, wallet, casinoId, currency ,recipientAddress
    })
    return response?.data;
  } catch (error) {
    throw error
    console.log("error in get balance", error);
  }
}