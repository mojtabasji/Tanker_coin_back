// user module to manage communications with database
import database from './database';
import { App_User, GameData, NetworkStatus } from '../utils/Types';
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

    static async getPagedUsersOrderByGameScore(page: number = 1, limit: number = 10): Promise<Array<App_User>> {
        const offset = (page - 1) * limit;
        // join users and game tables
        const query = `SELECT users.id, users.first_name, game.coins FROM users inner join game on users.gameData = game.id ORDER BY game.coins DESC LIMIT ${limit} OFFSET ${offset}`;
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

    // getFriends
    static async getFriends(friend_list: number[]): Promise<Array<App_User>> {
        const query = `SELECT users.id, users.first_name, game.coins FROM users inner join game on users.gameData = game.id WHERE users.id IN (${friend_list.join(',')})`;
        return await database.query(query);
    }

    // convert friends to array
    static convertFriendsToArray(friends: string): number[] {
        return JSON.parse(friends);
    }

    static async networkState(): Promise<NetworkStatus> {
        let usersCount = await database.query('SELECT COUNT(*) FROM users');
        let coinsCount = await database.query('SELECT SUM(coins) FROM game');
        return {
            UserCount: usersCount[0]['COUNT(*)'],
            extractedCoins: typeof coinsCount[0]['SUM(coins)'] === 'number' ? coinsCount[0]['SUM(coins)'] : parseInt(coinsCount[0]['SUM(coins)']),
        }
    }

}
