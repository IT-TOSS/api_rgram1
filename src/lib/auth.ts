import { sign, verify } from 'jsonwebtoken';
import { hash, compare } from 'bcryptjs';
import { User } from './models/user';
import { config } from './config';

const JWT_SECRET = config.jwtSecret;

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await compare(password, hashedPassword);
}

export function generateToken(user: User): string {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return sign(
    { 
      id: user._id ? user._id.toString() : '',
      email: user.email,
      username: user.username 
    },
    JWT_SECRET as string,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): { id: string; email: string; username: string } | null {
  try {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    const decoded = verify(token, JWT_SECRET as string) as { id: string; email: string; username: string };
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export function getUserFromRequest(req: Request): { id: string; email: string; username: string } | null {
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.split(' ')[1];
  return verifyToken(token);
}