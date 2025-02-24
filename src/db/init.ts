import sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../data/workoutlog.db');
let db: Database | null = null;

export async function initializeDatabase(): Promise<void> {
    // Close existing connection if it exists
    await closeDatabase();

    // Ensure the directory exists
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }

    return new Promise((resolve, reject) => {
        db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Error opening database:', err);
                reject(err);
                return;
            }

            db!.serialize(() => {
                try {
                    // Enable foreign keys
                    db!.run('PRAGMA foreign_keys = ON');

                    // Create users table if it doesn't exist
                    db!.run(`
                        CREATE TABLE IF NOT EXISTS users (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            username TEXT UNIQUE NOT NULL,
                            password TEXT NOT NULL,
                            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                        )
                    `);

                    // Create workout_files table if it doesn't exist
                    db!.run(`
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
                } catch (err) {
                    console.error('Error during database initialization:', err);
                    reject(err);
                }
            });
        });
    });
}

export function getDatabase(): Database {
    if (!db) {
        throw new Error('Database not initialized. Call initializeDatabase() first.');
    }
    return db;
}

export async function closeDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (db) {
            db.close((err) => {
                if (err) {
                    console.error('Error closing database:', err);
                    reject(err);
                } else {
                    console.log('Database connection closed');
                    db = null;
                    resolve();
                }
            });
        } else {
            resolve();
        }
    });
} 