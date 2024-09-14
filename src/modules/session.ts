import database from "./database";
import crypto from 'crypto';
import { App_User } from "../utils/Types";


class Session {
    private id: number | undefined;
    private userId: number;
    public sessionToken: string;
    private expirationDate: number;

    constructor(userId: number, sessionToken: string, expirationDate: number = new Date(Date.now() + 1000 * 60 * 60 * 24).getTime()) {
        this.userId = userId;
        this.sessionToken = sessionToken;
        this.expirationDate = expirationDate;
    }

    // get session by id
    static async getSessionById(id: number): Promise<Session> {
        const query = `SELECT * FROM sessions WHERE id = '${id}'`;
        const rows: Array<Session> = await database.query(query);
        return rows[0];
    }

    // get session by token
    static async getSessionByToken(sessionToken: string): Promise<Session> {
        const query = `SELECT * FROM sessions WHERE sessionToken = '${sessionToken}'`;
        const rows: Array<Session> = await database.query(query);
        return rows[0];
    }

    static async getSessionByUserId(userId: number): Promise<Session> {
        const query = `SELECT * FROM sessions WHERE userId = ${userId}`;
        const rows: Array<Session> = await database.query(query);
        return rows[0];
    }

    static async createSession(user: App_User): Promise<Session> {
        let session: Session = await Session.getSessionByUserId(user.id);
        if (session) {
            await Session.deleteSession(session.sessionToken);
        }
        session = new Session(user.id, Session.createSessionToken(user));
        const query = `INSERT INTO sessions (userId, sessionToken, expirationDate) VALUES (${session.userId}, '${session.sessionToken}', '${session.expirationDate}')`;
        await database.query(query);
        let newSession: Session = await Session.getSessionByToken(session.sessionToken);
        return newSession;
    }

    static createSessionToken(user: App_User): string {
        // Your logic to create a session token
        let salt = process.env.SESSION_SALT || '';
        let session_string = `${user.id}-${user.first_name}-${salt}`;

        // todo: should store it in session Table

        return crypto.createHash('sha256').update(session_string).digest('hex');
    }

    static async deleteSession(sessionToken: string): Promise<boolean> {
        // Your logic to delete a session token
        const query = `DELETE FROM sessions WHERE sessionToken = '${sessionToken}'`;
        await database.query(query);
        return true;
    }

    static async validateSessionToken(sessionToken: string, user_id: number | undefined = undefined): Promise<boolean> {
        // Your logic to validate a session token
        let session = await Session.getSessionByToken(sessionToken);
        if (!session) return false;
        if (session.expirationDate < new Date().getTime() || session.userId !== user_id ? user_id : session.userId) {
            await Session.deleteSession(sessionToken);
            return false;
        }
        return true;
    }
}

export default Session;