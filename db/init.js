"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = initializeDatabase;
exports.getDatabase = getDatabase;
exports.closeDatabase = closeDatabase;
const sqlite3_1 = __importDefault(require("sqlite3"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dbPath = process.env.DB_PATH || path_1.default.join(__dirname, '../../data/workoutlog.db');
let db = null;
async function initializeDatabase() {
    // Close existing connection if it exists
    await closeDatabase();
    // Ensure the directory exists
    const dbDir = path_1.default.dirname(dbPath);
    if (!fs_1.default.existsSync(dbDir)) {
        fs_1.default.mkdirSync(dbDir, { recursive: true });
    }
    return new Promise((resolve, reject) => {
        db = new sqlite3_1.default.Database(dbPath, (err) => {
            if (err) {
                console.error('Error opening database:', err);
                reject(err);
                return;
            }
            db.serialize(() => {
                try {
                    // Enable foreign keys
                    db.run('PRAGMA foreign_keys = ON');
                    // Create users table if it doesn't exist
                    db.run(`
                        CREATE TABLE IF NOT EXISTS users (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            username TEXT UNIQUE NOT NULL,
                            password TEXT NOT NULL,
                            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                        )
                    `);
                    // Create workout_files table if it doesn't exist
                    db.run(`
                        CREATE TABLE IF NOT EXISTS workout_files (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            user_id INTEGER NOT NULL,
                            filename TEXT NOT NULL,
                            content TEXT NOT NULL,
                            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                            UNIQUE(user_id, filename)
                        )
                    `, (err) => {
                        if (err) {
                            console.error('Error creating workout_files table:', err);
                            reject(err);
                            return;
                        }
                        resolve();
                    });
                }
                catch (err) {
                    console.error('Error during database initialization:', err);
                    reject(err);
                }
            });
        });
    });
}
function getDatabase() {
    if (!db) {
        throw new Error('Database not initialized. Call initializeDatabase() first.');
    }
    return db;
}
async function closeDatabase() {
    return new Promise((resolve, reject) => {
        if (db) {
            db.close((err) => {
                if (err) {
                    console.error('Error closing database:', err);
                    reject(err);
                }
                else {
                    console.log('Database connection closed');
                    db = null;
                    resolve();
                }
            });
        }
        else {
            resolve();
        }
    });
}
