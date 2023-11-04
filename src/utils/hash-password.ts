import bcrypt from 'bcrypt'

export async function hashPassword(
  password: string,
  saltRounds: number,
): Promise<string> {
  return await bcrypt.hash(password, saltRounds)
}

export async function compareHash(
  userPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(userPassword, hashedPassword)
}
