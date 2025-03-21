import { generateMnemonic } from 'bip39';
import { ethers } from 'ethers';
import { BIP32Factory } from 'bip32';
import * as bitcoin from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import crypto from 'crypto';

// Constants
const BITCOIN_NETWORK = bitcoin.networks.testnet;
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';

/**
 * Generates a new random mnemonic phrase for wallet creation
 * @returns {Promise<string>} A new BIP39 mnemonic phrase
 */
async function generateMasterPhrase() {
  return generateMnemonic();
}

/**
 * Creates a specified number of wallet addresses from the master keys
 * @param {number} numberOfWallets - Number of wallet addresses to generate
 * @returns {Array<Object>} Array of wallet objects containing user ID and addresses
 */
function createMultipleWallets(numberOfWallets,MNEMONIC) {
  const wallets = [];

  for (let i = 1; i <= numberOfWallets; i++) {
    const wallet = getWallet(i);
    wallets.push({
      userId: i,
      btcAddress: `your bitcoin wallet address is ${wallet.btcAddress}`,
      ethAddress: `your ethereum based network wallet address is ${wallet.ethAddress}`
    });
  }

  console.log("Generated wallets:", wallets);
  return wallets;
}

/**
 * Gets wallet addresses for a specific user ID
 * @param {number} userId - The user identifier
 * @returns {Object} Object containing the user's Bitcoin and Ethereum addresses
 */
function getWallet(userId,MNEMONIC) {
  const seed = bitcoin.crypto.sha256(Buffer.from(MNEMONIC));
  const bip32 = BIP32Factory(ecc);
  const bitcoinMasterKey = bip32.fromSeed(seed, BITCOIN_NETWORK);
  // Generate Bitcoin address
  const bitcoinChild = bitcoinMasterKey.derivePath(`m/0/${userId}`);
  const publicKeyBuffer = Buffer.from(bitcoinChild.publicKey);

  const { address: btcAddress } = bitcoin.payments.p2pkh({
    pubkey: publicKeyBuffer,
    network: BITCOIN_NETWORK
  });

  // Generate Ethereum address
  // Using the standard derivation path for Ethereum
  const ethPath = `m/44'/60'/0'/0/${userId}`;
  const ethWallet = ethers.HDNodeWallet.fromMnemonic(
    ethers.Mnemonic.fromPhrase(MNEMONIC),
    ethPath
  );

  return {
    userId,
    btcAddress,
    ethAddress: ethWallet.address,
    ethPrivatekey: ethWallet.privateKey
  };
}

/**
 * Retrieves private keys for a specific user ID
 * @param {number} userId - The user identifier
 * @returns {Object} Object containing the user's Bitcoin and Ethereum private keys
 */
function getPrivateKeys(userId,MNEMONIC) {
  // For Ethereum
  const ethPath = `m/44'/60'/0'/0/${userId}`;
  const ethWallet = ethers.HDNodeWallet.fromMnemonic(
    ethers.Mnemonic.fromPhrase(MNEMONIC),
    ethPath
  );
  const seed = bitcoin.crypto.sha256(Buffer.from(MNEMONIC));
  const bip32 = BIP32Factory(ecc);
  const bitcoinMasterKey = bip32.fromSeed(seed, BITCOIN_NETWORK);
  // For Bitcoin
  const bitcoinChild = bitcoinMasterKey.derivePath(`m/0/${userId}`);

  return {
    ethereumPrivateKey: ethWallet.privateKey,
    bitcoinPrivateKey: bitcoinChild.toWIF()
  };
}

/**
 * Encrypts wallet data with a password
 * @param {Object} data - The wallet data to encrypt
 * @param {string} password - The password to encrypt with
 * @returns {Object} The encrypted data with metadata needed for decryption
 */
function encryptWalletData(data, password) {
  // Generate a key from the password
  const salt = crypto.randomBytes(16);
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha512');

  // Generate a random initialization vector
  const iv = crypto.randomBytes(16);

  // Create cipher
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv);

  // Encrypt the data
  const dataStr = JSON.stringify(data);
  let encrypted = cipher.update(dataStr, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Get the auth tag for GCM mode
  const authTag = cipher.getAuthTag();

  return {
    encrypted,
    iv: iv.toString('hex'),
    salt: salt.toString('hex'),
    authTag: authTag.toString('hex')
  };
}

/**
 * Decrypts wallet data with a password
 * @param {Object} encryptedData - The encrypted data object
 * @param {string} password - The password to decrypt with
 * @returns {Object} The decrypted wallet data
 */
function decryptWalletData(encryptedData, password) {
  try {
    // Convert hex strings back to buffers
    const iv = Buffer.from(encryptedData.iv, 'hex');
    const salt = Buffer.from(encryptedData.salt, 'hex');
    const authTag = Buffer.from(encryptedData.authTag, 'hex');

    // Derive the key using the same parameters
    const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha512');

    // Create decipher
    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    // Decrypt the data
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error.message);
    throw new Error('Invalid password or corrupted data');
  }
}

/**
 * Encrypts and saves the mnemonic phrase
 * @param {string} mnemonic - The mnemonic phrase to encrypt
 * @param {string} password - The password to protect the mnemonic
 * @returns {Object} Encrypted mnemonic data
 */
function encryptMnemonic(mnemonic, password) {
  return encryptWalletData({ mnemonic }, password);
}

/**
 * Decrypts a stored mnemonic phrase
 * @param {Object} encryptedData - The encrypted mnemonic data
 * @param {string} password - The password to decrypt with
 * @returns {string} The decrypted mnemonic phrase
 */
function decryptMnemonic(encryptedData, password) {
  const decrypted = decryptWalletData(encryptedData, password);
  return decrypted.mnemonic;
}

// Export functions for module usage
export {
  generateMasterPhrase,
  createMultipleWallets,
  getWallet,
  getPrivateKeys,
  encryptWalletData,
  decryptWalletData,
  encryptMnemonic,
  decryptMnemonic
};