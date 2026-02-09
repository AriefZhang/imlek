import * as bcrypt from 'bcrypt'

type TemporaryPassword = { password: string; encryptedPassword: string }

/**
 * Encrypt a given password using bcrypt
 * @param {string} password The password to encrypt
 * @returns {Promise<string>} The encrypted password
 */
export const encryptPassword = async (password: string): Promise<string> => {
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS)
  const salt = await bcrypt.genSalt(saltRounds)
  return await bcrypt.hash(password, salt)
}

/**
 * Compares a given password with a hashed password using bcrypt
 * @param {string} password The password to compare
 * @param {string} hashedPassword The hashed password to compare with
 * @returns {Promise<boolean>} Whether the passwords match
 */
export const decryptPassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword)
}

/**
 * Generates a temporary password and its corresponding encrypted version
 * @returns {Promise<TemporaryPassword>} A promise that resolves with an object containing the
 * password and its encrypted version
 */
export const generateTemporaryPassword = async (
  num?: number,
): Promise<TemporaryPassword> => {
  const password = Math.random()
    .toString(36)
    .slice(2, num ?? 10)
  const encryptedPassword = await encryptPassword(password)
  return { password, encryptedPassword }
}
