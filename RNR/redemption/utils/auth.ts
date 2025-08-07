import { authenticator } from 'otplib';
import QRCode from 'qrcode';

// Function to generate a PBKDF2 hash
export async function hashPasswordPBKDF2(password: string) {
  const encoder = new TextEncoder();
  const passwordBytes = encoder.encode(password);

  // Generate a random 16-byte salt
  const salt = crypto.getRandomValues(new Uint8Array(16));

  // Import password as a CryptoKey for PBKDF2
  const key = await crypto.subtle.importKey(
    "raw",
    passwordBytes,
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  // Derive bits using PBKDF2 with HMAC-SHA-256, 100,000 iterations
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000, // OWASP recommends at least 100k for HMAC-SHA256
      hash: "SHA-256",
    },
    key,
    256 // Derive 256 bits = 32 bytes
  );

  // Convert derived bits to hex string
  const hashArray = new Uint8Array(derivedBits);
  const hashHex = Array.from(hashArray)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Convert salt to hex to store
  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return { hash: hashHex, salt: saltHex };
}

export async function verifyPasswordPBKDF2(
  password: string,
  storedHashHex: string,
  storedSaltHex: string
) {
  const encoder = new TextEncoder();

  const passwordBytes = encoder.encode(password);

  // Decode salt hex to Uint8Array
  const saltBytes = Uint8Array.from(
    (storedSaltHex.match(/.{1,2}/g) || []).map((byte) => parseInt(byte, 16))
  );

  // Import password as key
  const key = await crypto.subtle.importKey(
    "raw",
    passwordBytes,
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  // Derive bits with PBKDF2 using password & salt
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBytes,
      iterations: 100000,
      hash: "SHA-256",
    },
    key,
    256 // 256 bits = 32 bytes
  );

  // Convert derived bits to hex string
  const derivedBytes = new Uint8Array(derivedBits);
  const derivedHex = Array.from(derivedBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Constant-time comparison of stored and derived hashes (both hex strings)
  // Constant time comparison helper to prevent timing attacks
  function constantTimeCompare(a: string, b: string) {
    if (a.length !== b.length) return false;
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      //XOR each char to see if they differ, OR with result to record any difference as nonzero value
      result |= a.charCodeAt(i) ^ b.charCodeAt(i); 
    }
    return result === 0;
  }
  return constantTimeCompare(derivedHex, storedHashHex);
}

// Generate a secret for a user
export const generateTwoFactorSecret = (email: string) => {
  const secret = authenticator.generateSecret();
  const serviceName = 'redemption_rnr';
  const otpAuthUrl = authenticator.keyuri(email, serviceName, secret);

  return { secret, otpAuthUrl };
};

// Generate QR code as data URL
export const generateQRCode = async (otpAuthUrl: string) => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(otpAuthUrl);
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

// Verify OTP code
export const verifyToken = (token: string, secret: string) => {
  try {
    return authenticator.verify({ token, secret });
  } catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
};