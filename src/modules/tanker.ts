import database from "./database";
import { TankerType } from "../utils/Types";

export default class Tanker {
    tableName: string = 'tankers';
    id: number;
    power: number;
    capacity: number;
    speed: number;
    price: number;
    image: string;
    name?: string;

    constructor(tankerType: TankerType = {id: 1, power: 50, capacity: 50,  speed: 0.2, price: 0, image: ''}) {
        this.id = tankerType.id;
        this.power = tankerType.power;
        this.capacity = tankerType.capacity;
        this.speed = tankerType.speed;
        this.price = tankerType.price;
        this.image = tankerType.image;
        this.name = tankerType.name;
    }

    // get tanker by id
    static async getTankerById(tankerId: number): Promise<Tanker> {
        const query = `SELECT * FROM tankers WHERE id = ${tankerId}`;
        const rows: Array<Tanker> = await database.query(query);
        return rows[0];
    }

    // get all tankers
    static async getAllTankers(): Promise<Array<Tanker>> {
        const query = 'SELECT * FROM tankers';
        return await database.query(query);
    }

    // create a new tanker
    static async createTanker(tanker: Tanker): Promise<Tanker> {
        const query = `INSERT INTO tankers (id, power) VALUES (${tanker.id}, ${tanker.power})`;
        await database.query(query);
        return tanker;
    }

    
}