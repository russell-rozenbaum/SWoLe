"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveWorkoutFile = saveWorkoutFile;
exports.getUserWorkoutFiles = getUserWorkoutFiles;
exports.getWorkoutFile = getWorkoutFile;
exports.deleteWorkoutFile = deleteWorkoutFile;
const init_1 = require("./init");
async function saveWorkoutFile(userId, filename, content, update = false) {
    const db = (0, init_1.getDatabase)();
    return new Promise((resolve, reject) => {
        // First check if file exists
        db.get('SELECT * FROM workout_files WHERE user_id = ? AND filename = ?', [userId, filename], (err, existingFile) => {
            if (err) {
                reject(err);
                return;
            }
            if (existingFile && !update) {
                reject(new Error('UNIQUE constraint failed: A file for this date already exists'));
                return;
            }
            if (existingFile) {
                // Update existing file
                db.run('UPDATE workout_files SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [content, existingFile.id], function (err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve({
                        ...existingFile,
                        content,
                        updated_at: new Date().toISOString()
                    });
                });
            }
            else {
                // Insert new file
                db.run('INSERT INTO workout_files (user_id, filename, content) VALUES (?, ?, ?)', [userId, filename, content], function (err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    db.get('SELECT * FROM workout_files WHERE id = ?', [this.lastID], (err, row) => {
                        if (err) {
                            reject(err);
                        }
                        else if (!row) {
                            reject(new Error('File not found after saving'));
                        }
                        else {
                            resolve(row);
                        }
                    });
                });
            }
        });
    });
}
async function getUserWorkoutFiles(userId) {
    const db = (0, init_1.getDatabase)();
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM workout_files WHERE user_id = ? ORDER BY updated_at DESC', [userId], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows || []);
            }
        });
    });
}
async function getWorkoutFile(userId, fileId) {
    const db = (0, init_1.getDatabase)();
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM workout_files WHERE id = ? AND user_id = ?', [fileId, userId], (err, row) => {
            if (err) {
                reject(err);
            }
            else if (!row) {
                reject(new Error('Workout file not found'));
            }
            else {
                resolve(row);
            }
        });
    });
}
async function deleteWorkoutFile(userId, fileId) {
    const db = (0, init_1.getDatabase)();
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM workout_files WHERE id = ? AND user_id = ?', [fileId, userId], (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}
