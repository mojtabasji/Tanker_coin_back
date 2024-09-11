import { Router, Request, Response } from 'express';
import validators from '../utils/validator';
import userOptions from '../utils/user';
import { type Tg_User, type App_User } from '../utils/Types'; 

const router = Router();

// login user
/**
 * @swagger
 * /api/login:
 *  post:
 *    description: check if user is registered in the database and login user and set session token
 *    requestBody:
 *      required: true
 *      content:
 *          application/json:
 *          schema:
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                      example: John Doe
 *    responses:
 *      201:
 *          description: User Logged in successfully
 *      400:
 *          description: Bad request
 *      500:
 *          description: Internal server error
 */
router.post('/login', (req, res) => {
    // Your logic to login a user
    let user: App_User;
    const temporal_user: Tg_User = { id: 1, username: 'John Doe' }; // dummy user - replace with your logic with req.body
    if( userOptions.checkUserExists(temporal_user) ) {
        user = userOptions.getUser(temporal_user);
    } else {
        user = userOptions.createUser(temporal_user);
    }
    const session_token = userOptions.createSessionToken(user);
    res.cookie('session_token', session_token, { httpOnly: true });
    res.status(201).json({ user, session_token });
});

export default router;