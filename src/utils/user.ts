import { Request, Response } from 'express';
import { type App_User, WebAppUser, } from './Types';
import * as crypto from 'crypto';
import User from '../modules/user';

export default class UserOptions {
    static async createUserComplete(user: WebAppUser, friend_id: string | null = null): Promise<App_User> {
        let newUser: App_User = new User();
        newUser.tg_id = user.id;
        newUser.first_name = user.first_name;
        newUser.username = user.username;
        newUser = await User.createUser(newUser);
        // Your logic to create a new user
        if (friend_id) {
            // Your logic to add a friend and give some rewards
            let friend: App_User | null = await User.getUserByTgId(parseInt(friend_id));
            if (friend && newUser.id) {
                friend.friends = User.convertFriendsToArray(friend.friends as any);
                friend.friends.push(newUser.id);
                friend = await User.updateUser(friend);
            }
        }
        return newUser;
    }


    static async getUser(user: WebAppUser): Promise<App_User> {
        // Your logic to get a user
        return await User.getUserByTgId(user.id);
    }

    static async checkUserExists(user: WebAppUser | App_User) {
        // Your logic to check if the user exists
        if ('tg_id' in user) {
            if (!user.tg_id) {
                if (!user.id) return false;
                return await User.getUserById(user.id) ? true : false;
            }
            return await User.getUserByTgId(user.tg_id) ? true : false;
        } else {
            return await User.getUserByTgId(user.id) ? true : false;
        }
    }

    static createSessionToken(user: App_User) {
        // Your logic to create a session token
        let salt = process.env.SESSION_SALT || '';
        let session_string = `${user.id}-${user.first_name}-${salt}`;

        // todo: should store it in session Table

        return crypto.createHash('sha256').update(session_string).digest('hex');
    }
}