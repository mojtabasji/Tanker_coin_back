

interface Tg_User {
    id: number;
    username: string;
    hasFriend?: boolean;
    FriendId?: number;
}

interface App_User {
    id: number;
    email: string;
    username: string;
}

interface GameData {
    id: number;
    user_id: number;
    score: number;
    level: number;
}

export { Tg_User, App_User };
