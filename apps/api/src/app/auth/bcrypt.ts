import * as bcrypt from 'bcrypt';

export function encodePassword(rawPassword: string) {
  const SALT = bcrypt.genSaltSync();
  const hashedP = bcrypt.hashSync(rawPassword, SALT);
  //const hashedP = await bcrypt.hash(rawPassword, saltOrRounds);
  return hashedP;
  //return hashedP;
}
export function comparePasswords(rawPassword: string, hashP: string) {
  return bcrypt.compare(rawPassword, hashP);
}
