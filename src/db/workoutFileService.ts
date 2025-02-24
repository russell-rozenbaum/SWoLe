import { getDatabase } from './init';

export interface WorkoutFile {
    id: number;
    user_id: number;
    filename: string;
    content: string;
    created_at: string;
    updated_at: string;
}

export async function saveWorkoutFile(userId: number, filename: string, content: string, update: boolean = false): Promise<WorkoutFile> {
    const db = getDatabase();

    return new Promise((resolve, reject) => {
        // First check if file exists
        db.get<WorkoutFile>(
            'SELECT * FROM workout_files WHERE user_id = ? AND filename = ?',
            [userId, filename],
            (err, existingFile) => {
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
                    db.run(
                        'UPDATE workout_files SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                        [content, existingFile.id],
                        function(err) {
                            if (err) {
                                reject(err);
                                return;
                            }
                            resolve({
                                ...existingFile,
                                content,
                                updated_at: new Date().toISOString()
                            });
                        }
                    );
                } else {
                    // Insert new file
                    db.run(
                        'INSERT INTO workout_files (user_id, filename, content) VALUES (?, ?, ?)',
                        [userId, filename, content],
                        function(err) {
                            if (err) {
                                reject(err);
                                return;
                            }

                            db.get<WorkoutFile>(
                                'SELECT * FROM workout_files WHERE id = ?',
                                [this.lastID],
                                (err, row) => {
                                    if (err) {
                                        reject(err);
                                    } else if (!row) {
                                        reject(new Error('File not found after saving'));
                                    } else {
                                        resolve(row);
                                    }
                                }
                            );
                        }
                    );
                }
            }
        );
    });
}

export async function getUserWorkoutFiles(userId: number): Promise<WorkoutFile[]> {
    const db = getDatabase();

    return new Promise((resolve, reject) => {
        db.all<WorkoutFile>(
            'SELECT * FROM workout_files WHERE user_id = ? ORDER BY updated_at DESC',
            [userId],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows || []);
                }
            }
        );
    });
}

export async function getWorkoutFile(userId: number, fileId: number): Promise<WorkoutFile> {
    const db = getDatabase();

    return new Promise((resolve, reject) => {
        db.get<WorkoutFile>(
            'SELECT * FROM workout_files WHERE id = ? AND user_id = ?',
            [fileId, userId],
            (err, row) => {
                if (err) {
                    reject(err);
                } else if (!row) {
                    reject(new Error('Workout file not found'));
                } else {
                    resolve(row);
                }
            }
        );
    });
}

export async function deleteWorkoutFile(userId: number, fileId: number): Promise<void> {
    const db = getDatabase();

    return new Promise((resolve, reject) => {
        db.run(
            'DELETE FROM workout_files WHERE id = ? AND user_id = ?',
            [fileId, userId],
            (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            }
        );
    });
} 