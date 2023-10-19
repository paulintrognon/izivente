import * as bcrypt from 'bcryptjs'

/**
 * Hash based on bcrypt (salt 10 times)
 */
export async function hashSecret(secret: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(secret, salt)
  return hash
}

/**
 * Return true if provided non-hashed string is compatible with hashed string
 * Return false otherwise
 */
export function compareHash(secretInClear: string, secretHashed: string): boolean {
  return bcrypt.compareSync(secretInClear, secretHashed)
}
