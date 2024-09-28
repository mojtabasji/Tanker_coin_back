import database from "./database";
import Tanker from "./tanker";
import { GameData, TankerType } from "../utils/Types";
import User from "./user";

export default class Game {
    tableName: string = 'game';
    id: number;
    mineable: boolean;
    coins: number;
    power: number;
    activeTanker: Tanker;
    unlockedTankers: number[];
    lastUpdate: number;

    constructor() {
        this.id = 0;
        this.mineable = true;
        this.coins = 0;
        this.power = 0;
        this.activeTanker = new Tanker();
        this.unlockedTankers = [1];
        this.lastUpdate = Number(new Date());
    }

    // get game data by id
    static async getGameDataById(gameDataId: number): Promise<GameData> {
        const query = `SELECT * FROM game WHERE id = ${gameDataId}`;
        const rows: Array<GameData> = await database.query(query);
        return rows[0];
    }

    static async getLatestGameData(): Promise<GameData> {
        const query = `SELECT * FROM game ORDER BY id DESC LIMIT 1`;
        const rows: Array<GameData> = await database.query(query);
        return rows[0];
    }

    // create a new game data
    static async createGameData(gameData: GameData): Promise<GameData> {
        const query = `INSERT INTO game (mineable, coins, power, activeTanker, unlockedTankers, lastUpdate) VALUES (${gameData.mineable}, ${gameData.coins}, ${gameData.power}, ${typeof gameData.activeTanker != "number" ? gameData.activeTanker.id : gameData.activeTanker}, '${JSON.stringify(gameData.unlockedTankers)}', ${gameData.lastUpdate})`;
        await database.query(query);
        let newGameData: GameData = await Game.getLatestGameData();
        return newGameData;
    }

    // update game data
    static async updateGameData(gameData: GameData, userID: number, approach: string | null = null): Promise<GameData | string> {
        let user = await User.getUserById(userID);
        if (user.gameData != gameData.id) {
            return "User does not own this game data";
        }
        let query: string;
        if (approach && approach == "coin_increase")
            query = `UPDATE game SET mineable = ${gameData.mineable}, coins = ${gameData.coins}, power = ${gameData.power}, activeTanker = ${typeof gameData.activeTanker != "number" ? gameData.activeTanker.id : gameData.activeTanker}, unlockedTankers = ${JSON.stringify(gameData.unlockedTankers)}, lastUpdate = ${gameData.lastUpdate} WHERE id = ${gameData.id} AND coins <= ${gameData.coins}`;
        else
            query = `UPDATE game SET mineable = ${gameData.mineable}, coins = ${gameData.coins}, power = ${gameData.power}, activeTanker = ${typeof gameData.activeTanker != "number" ? gameData.activeTanker.id : gameData.activeTanker}, unlockedTankers = ${JSON.stringify(gameData.unlockedTankers)}, lastUpdate = ${gameData.lastUpdate} WHERE id = ${gameData.id}`;
        await database.query(query);
        return gameData;
    }

    static async saveGameData(gameData: GameData, userID: number): Promise<GameData | string> {
        if (gameData.id) {
            return await Game.updateGameData(gameData, userID);
        } else {
            return await Game.createGameData(gameData);
        }
    }
}