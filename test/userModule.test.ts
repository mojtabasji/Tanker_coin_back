// src/user.test.ts
import mysql from 'mysql2/promise';
import User from '../src/modules/user';
import { App_User } from '../src/utils/Types';

// Mock the mysql2/promise module
jest.mock('mysql2/promise', () => {
    const mQuery = jest.fn();
    const mPool = {
        query: mQuery,
        execute: mQuery,
        end: jest.fn(),
        // You can add other methods if needed
    };
    return {
        createPool: jest.fn(() => mPool),
    };
});

describe('User Module', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    it('should fetch users successfully', async () => {
        // set the mock value for the execute method query of the pool
        (mysql.createPool({}).query as jest.Mock).mockResolvedValue([[{ id: 1, name: 'John Doe'}], {}]);

        const users: App_User | null = await User.getUserById(1);

        expect(users).toEqual({ id: 1, name: 'John Doe' });
        expect(mysql.createPool({}).query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = 1');
    });

    it('should return an null on connection error', async () => {
        // Mock the connection to throw an exception
        (mysql.createPool({}).query as jest.Mock).mockRejectedValue(new Error('Error querying the database'));

        const users: App_User | null = await User.getUserById(1);

        await expect(users).toEqual(null);
    });

    it('should return an null if no user is found', async () => {
        // Mock the connection to return an empty array
        const mockExecute = (mysql.createPool({}).query as jest.Mock).mockResolvedValue([[], {}]);

        const users: App_User | null = await User.getUserById(2);

        expect(users).toEqual(null);
        expect(mockExecute).toHaveBeenCalledWith('SELECT * FROM users WHERE id = 2');
    });

    it('should return undefined is user is not found', async () => {
        // Mock the connection to return an empty array
        const mockExecute = (mysql.createPool({}).query as jest.Mock).mockResolvedValue([[], {}]);

        const users: App_User = await User.getUserByTgId(2);

        expect(users).toEqual(undefined);
        expect(mockExecute).toHaveBeenCalledWith('SELECT * FROM users WHERE tg_id = 2');
    });
});
