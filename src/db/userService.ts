import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDatabase } from './init';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // In production, use a proper secret
const SALT_ROUNDS = 10;

export interface User {
    id: number;
    username: string;
    created_at: string;
}

interface UserRecord extends User {
    password: string;
}

export interface UserCredentials {
    username: string;
    password: string;
}

export async function getUserById(userId: number): Promise<User> {
    const db = getDatabase();

    return new Promise((resolve, reject) => {
        db.get<User>(
            'SELECT id, username, created_at FROM users WHERE id = ?',
            [userId],
            (err, user) => {
                if (err) {
                    reject(err);
                } else if (!user) {
                    reject(new Error('User not found'));
                } else {
                    resolve(user);
                }
            }
        );
    });
}

export async function createUser(credentials: UserCredentials): Promise<User> {
    const db = getDatabase();
    const hashedPassword = await bcrypt.hash(credentials.password, SALT_ROUNDS);

    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [credentials.username, hashedPassword],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        reject(new Error('Username already exists'));
                    } else {
                        reject(err);
                    }
                    return;
                }

                db.get<User>(
                    'SELECT id, username, created_at FROM users WHERE id = ?',
                    [this.lastID],
                    (err, user) => {
                        if (err) {
                            reject(err);
                        } else if (!user) {
                            reject(new Error('User not found after creation'));
                        } else {
                            resolve(user);
                        }
                    }
                );
            }
        );
    });
}

export async function authenticateUser(credentials: UserCredentials): Promise<string> {
    const db = getDatabase();

    return new Promise((resolve, reject) => {
        db.get<UserRecord>(
            'SELECT * FROM users WHERE username = ?',
            [credentials.username],
            async (err, user) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (!user) {
                    reject(new Error('User not found'));
                    return;
                }

                const passwordMatch = await bcrypt.compare(credentials.password, user.password);
                if (!passwordMatch) {
                    reject(new Error('Invalid password'));
                    return;
                }

                const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
                resolve(token);
            }
        );
    });
} 