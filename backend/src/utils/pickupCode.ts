/**
 * Pickup Verification Code Generator
 * Generates a human-readable 6-8 character verification code for CampusPrint orders.
 * Excludes ambiguous characters (0, O, 1, I).
 */
export const generatePickupCode = (prefix: string = 'CP-'): string => {
  const allowedChars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  const codeLength = 6;
  let result = '';

  for (let i = 0; i < codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * allowedChars.length);
    result += allowedChars.charAt(randomIndex);
  }

  return `${prefix}${result}`;
};
