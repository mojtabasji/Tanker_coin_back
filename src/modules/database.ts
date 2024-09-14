import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

const env = dotenv.config();

class Database {
    private connection: mysql.Connection;

    constructor() {
        this.connection = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'test',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    async query(query: string): Promise<any> {
        try {
            const [rows] = await this.connection.query(query);
            return rows;
        } catch (error) {
            console.error("Error querying the database ... ", error);
        }
        return [];
    }

    async close() {
        await this.connection.end();
    }
}


const database = new Database();

async function test() {
    let value = await database.query('SELECT * FROM users');
    console.log("result value", value);
}

if (require.main === module) {
    console.log("# in main");
    test();
}


export default database;