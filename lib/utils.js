import { beltAliasMapping } from '@/data/beltMapper';
import jwt from 'jsonwebtoken';


/**
 * Takes a fuzzy input string from an AI and finds the matching canonical
 * key from our belt data.
 * @param aiSuggestion The raw string from the AI (e.g., "Foundation Belt").
 * @returns The canonical key (e.g., "foundation") or null if no match is found.
 */
export function getCanonicalBeltKey(aiSuggestion){
  if (!aiSuggestion) {
    return null;
  }

  const normalizedInput = aiSuggestion.toLowerCase().trim();

  const foundEntry = Object.entries(beltAliasMapping).find(
    ([canonicalKey, aliases]) => aliases.includes(normalizedInput)
  );

  return foundEntry ? foundEntry[0] : null;
}

/**
 * Generates a JSON Web Token (JWT).
 * This function should only be called on the server-side.
 * @param {string} id - The user's unique identifier (e.g., database ID).
 * @param {string} role - The user's role (e.g., 'admin', 'user').
 * @returns {string} The generated JWT.
 */
export const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '3h', // Token expires in 3 hours
  });
};

/**
 * Verifies a JSON Web Token (JWT).
 * This function checks if the token is valid and not expired.
 * @param {string} token - The JWT string to verify.
 * @returns {object | null} The decoded payload if the token is valid, otherwise null.
 */
export const verifyToken = (token) => {
  try {
    // jwt.verify will throw an error if the token is invalid (e.g., expired, wrong signature)
    // You MUST use the exact same secret that was used to sign the token.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // The decoded object contains the original payload: { id, role, iat, exp }
    return decoded;
  } catch (error) {
    // If verification fails, it will enter this catch block.
    console.error("JWT Verification Error:", error.message);
    return null;
  }
};