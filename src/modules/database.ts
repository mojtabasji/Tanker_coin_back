import mysql from 'mysql2/promise';

class Database {
    private connection: mysql.Connection;

    constructor() {
        this.connection = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'tel_app',
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