import bcrypt from 'bcrypt';

const NUMBER_OF_SALT_ROUNDS = 10;

export async function generateHashedPassword(painTextPassword: string) {
  const hashedPassword = await bcrypt.hash(painTextPassword, NUMBER_OF_SALT_ROUNDS);
  return hashedPassword;
}

export async function compareHashedPassword(plainTextPassword: string, hashedPassword: string) {
  const result = await bcrypt.compare(plainTextPassword, hashedPassword);
  return result;
}