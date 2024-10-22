import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, saltOrRounds);
}

export async function comparePasswords(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
