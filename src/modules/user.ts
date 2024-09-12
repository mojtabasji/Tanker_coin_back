// user module to manage communications with database
import database from './database';
import { App_User, GameData } from '../utils/Types';
import Game from './game';

export default class User {
    tableName?: string = 'users';
    id: number;
    tg_id: number;
    first_name: string;
    username?: string;
    gameData?: any;
    friends: number[];

    constructor(user: App_User = { id: 0, tg_id: 0, first_name: '', username: '', friends: [] }) {
        this.id = user.id;
        this.tg_id = user.tg_id;
        this.first_name = user.first_name;
        this.username = user.username;
        this.friends = user.friends;
    }

    // get user by id
    static async getUserById(userId: number): Promise<App_User> {
        const query = `SELECT * FROM users WHERE id = ${userId}`;
        const rows: Array<App_User> = await database.query(query);
        return rows[0];
    }

    // get user by tg_id
    static async getUserByTgId(tgId: number): Promise<App_User> {
        const query = `SELECT * FROM users WHERE tg_id = ${tgId}`;
        const rows: Array<App_User> = await database.query(query);
        return rows[0];
    }

    // get all users
    static async getAllUsers(): Promise<Array<App_User>> {
        const query = 'SELECT * FROM users';
        return await database.query(query);
    }

    // create a new user
    static async createUser(user: App_User): Promise<App_User> {
        let newGame: GameData = new Game();
        newGame = await Game.createGameData(newGame);
        const query = `INSERT INTO users (tg_id, first_name, username, gameData, friends) VALUES (${user.tg_id}, '${user.first_name}', '${user.username}', ${newGame.id}, '${JSON.stringify(user.friends)}')`;
        await database.query(query);
        let newUser: App_User = await User.getUserByTgId(user.tg_id);
        return newUser;
    }

    // update user
    static async updateUser(user: App_User): Promise<App_User> {
        const query = `UPDATE users SET tg_id = ${user.tg_id}, first_name = '${user.first_name}', username = '${user.username}', gameData = ${user.gameData}, friends = '${JSON.stringify(user.friends)}' WHERE id = ${user.id}`;
        await database.query(query);
        let updatedUser: App_User = await User.getUserById(user.id);
        return updatedUser;
    }

    // convert friends to array
    static convertFriendsToArray(friends: string): number[] {
        return JSON.parse(friends);
    }

}
