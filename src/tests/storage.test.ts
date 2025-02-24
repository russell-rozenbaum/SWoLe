import { initializeDatabase, closeDatabase } from '../db/init';
import { createUser, authenticateUser } from '../db/userService';
import { saveWorkoutFile, getUserWorkoutFiles, getWorkoutFile, deleteWorkoutFile } from '../db/workoutFileService';
import fs from 'fs';
import path from 'path';

describe('Storage System', () => {
    const testDbPath = path.join(__dirname, '../../data/test_workoutlog.db');
    const testUser = {
        username: 'testuser',
        password: 'testpass123'
    };

    beforeAll(() => {
        // Set test database path
        process.env.DB_PATH = testDbPath;
    });

    beforeEach(async () => {
        // Clean up and reinitialize database before each test
        try {
            await closeDatabase();
            if (fs.existsSync(testDbPath)) {
                fs.unlinkSync(testDbPath);
            }
            await initializeDatabase();
        } catch (err) {
            console.error('Error in test setup:', err);
            throw err;
        }
    });

    afterEach(async () => {
        try {
            await closeDatabase();
            if (fs.existsSync(testDbPath)) {
                fs.unlinkSync(testDbPath);
            }
        } catch (err) {
            console.error('Error in test cleanup:', err);
        }
    });

    it('should create a new user', async () => {
        const user = await createUser(testUser);
        expect(user).toBeDefined();
        expect(user.username).toBe(testUser.username);
    });

    it('should authenticate user with correct credentials', async () => {
        const user = await createUser(testUser);
        const token = await authenticateUser(testUser);
        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
    });

    it('should reject authentication with incorrect password', async () => {
        await createUser(testUser);
        await expect(authenticateUser({
            username: testUser.username,
            password: 'wrongpass'
        })).rejects.toThrow('Invalid password');
    });

    describe('Workout Files', () => {
        let userId: number;

        beforeEach(async () => {
            try {
                const user = await createUser({
                    username: 'filetest',
                    password: 'testpass123'
                });
                userId = user.id;
            } catch (err) {
                console.error('Error in workout files setup:', err);
                throw err;
            }
        });

        it('should save a workout file', async () => {
            const file = await saveWorkoutFile(userId, 'test.swl', 'workout content');
            expect(file).toBeDefined();
            expect(file.filename).toBe('test.swl');
            expect(file.content).toBe('workout content');
        });

        it('should list user workout files', async () => {
            await saveWorkoutFile(userId, 'test.swl', 'workout content');
            const files = await getUserWorkoutFiles(userId);
            expect(Array.isArray(files)).toBe(true);
            expect(files.length).toBeGreaterThan(0);
            expect(files[0].filename).toBe('test.swl');
        });

        it('should get a specific workout file', async () => {
            const savedFile = await saveWorkoutFile(userId, 'test.swl', 'workout content');
            const file = await getWorkoutFile(userId, savedFile.id);
            expect(file).toBeDefined();
            expect(file.filename).toBe('test.swl');
            expect(file.content).toBe('workout content');
        });

        it('should delete a workout file', async () => {
            const savedFile = await saveWorkoutFile(userId, 'test.swl', 'workout content');
            await deleteWorkoutFile(userId, savedFile.id);
            const files = await getUserWorkoutFiles(userId);
            expect(files.length).toBe(0);
        });
    });
}); 