import jwt, { Secret, SignOptions } from 'jsonwebtoken';

const SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production';

export const jwtSign = (
  payload: string | object | Buffer,
  options: { expiresIn?: string } = {}
): string => {
  const signOptions: SignOptions = {};
  if (options.expiresIn) signOptions.expiresIn = options.expiresIn as any;
  return jwt.sign(payload as any, SECRET as Secret, signOptions);
};

export const jwtVerify = (token: string): any => {
  try {
    return jwt.verify(token, SECRET as Secret);
  } catch (error) {
    return null;
  }
};

export const jwtDecode = (token: string): any => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};
