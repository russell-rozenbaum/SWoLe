"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = getUserById;
exports.createUser = createUser;
exports.authenticateUser = authenticateUser;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const init_1 = require("./init");
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // In production, use a proper secret
const SALT_ROUNDS = 10;
async function getUserById(userId) {
    const db = (0, init_1.getDatabase)();
    return new Promise((resolve, reject) => {
        db.get('SELECT id, username, created_at FROM users WHERE id = ?', [userId], (err, user) => {
            if (err) {
                reject(err);
            }
            else if (!user) {
                reject(new Error('User not found'));
            }
            else {
                resolve(user);
            }
        });
    });
}
async function createUser(credentials) {
    const db = (0, init_1.getDatabase)();
    const hashedPassword = await bcryptjs_1.default.hash(credentials.password, SALT_ROUNDS);
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO users (username, password) VALUES (?, ?)', [credentials.username, hashedPassword], function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    reject(new Error('Username already exists'));
                }
                else {
                    reject(err);
                }
                return;
            }
            db.get('SELECT id, username, created_at FROM users WHERE id = ?', [this.lastID], (err, user) => {
                if (err) {
                    reject(err);
                }
                else if (!user) {
                    reject(new Error('User not found after creation'));
                }
                else {
                    resolve(user);
                }
            });
        });
    });
}
async function authenticateUser(credentials) {
    const db = (0, init_1.getDatabase)();
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE username = ?', [credentials.username], async (err, user) => {
            if (err) {
                reject(err);
                return;
            }
            if (!user) {
                reject(new Error('User not found'));
                return;
            }
            const passwordMatch = await bcryptjs_1.default.compare(credentials.password, user.password);
            if (!passwordMatch) {
                reject(new Error('Invalid password'));
                return;
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
            resolve(token);
        });
    });
}
