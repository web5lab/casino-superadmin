import crypto from 'crypto';

const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const SALT_LENGTH = 32;
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

export const keystore = {
  /**
   * Encrypts a private key with a password
   */
  encryptPrivateKey(privateKey, password) {
    // Generate salt and derive key
    const salt = crypto.randomBytes(SALT_LENGTH);
    const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
    
    // Generate initialization vector
    const iv = crypto.randomBytes(IV_LENGTH);
    
    // Create cipher and encrypt
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv);
    
    // Encrypt the private key
    let encryptedKey = cipher.update(privateKey, 'utf8', 'hex');
    encryptedKey += cipher.final('hex');
    
    // Get authentication tag
    const authTag = cipher.getAuthTag();
    
    // Combine all components into a single string
    const combined = Buffer.concat([
      salt,
      iv,
      authTag,
      Buffer.from(encryptedKey, 'hex')
    ]);
    
    return combined.toString('base64');
  },

  /**
   * Decrypts an encrypted private key with a password
   */
  decryptPrivateKey(encryptedData, password) {
    try {
      // Convert base64 to buffer
      const data = Buffer.from(encryptedData, 'base64');
      
      // Extract components
      const salt = data.slice(0, SALT_LENGTH);
      const iv = data.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
      const authTag = data.slice(
        SALT_LENGTH + IV_LENGTH,
        SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH
      );
      const encryptedKey = data.slice(SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH);
      
      // Derive key from password and salt
      const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
      
      // Create decipher
      const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, key, iv);
      decipher.setAuthTag(authTag);
      
      // Decrypt
      let decrypted = decipher.update(encryptedKey);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      
      return decrypted.toString('utf8');
    } catch (error) {
      throw new Error('Failed to decrypt private key. Invalid password or corrupted data.');
    }
  },

  /**
   * Generates a secure random password
   */
  generatePassword(length = 32) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let password = '';
    const values = new Uint32Array(length);
    crypto.randomFillSync(values);
    for (let i = 0; i < length; i++) {
      password += charset[values[i] % charset.length];
    }
    return password;
  }
};