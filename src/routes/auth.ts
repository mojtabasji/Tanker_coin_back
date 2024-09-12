import { Router, Request, Response } from 'express';
import validators from '../utils/validator';
import userOptions from '../utils/user';
import { type App_User, WebAppInitData, WebAppUser } from '../utils/Types'; 

const router = Router();

// login user
/**
 * @swagger
 * /api/login:
 *  post:
 *    description: check if user is registered in the database and login user and set session token
 *    summary: Login user
 *    requestBody:
 *      description: Optional description in *Markdown*
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: string
 *            example: { "initData": "auth_date=1620000000\nfirst_name=John\nhash=hash", friend_id: "123456789" }
 *        application/xml:
 *          schema:
 *            type: string
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: string
 *        text/plain:
 *          schema:
 *            type: string
 *    responses:
 *      201:
 *          description: User Logged in successfully
 *      400:
 *          description: Bad request
 *      500:
 *          description: Internal server error
 */
router.post('/login', async (req, res) => {
    // Your logic to login a user
    let tg_user: WebAppUser;
    let app_user: App_User;

    const initData = req.body.initData;
    const friend_id = req.body.friend_id;

    let {isValid, data} = validators.ValidateData(initData, 0);
    if(isValid) {
        tg_user = data.user;
        if(await userOptions.checkUserExists(tg_user)) {
            app_user = await userOptions.getUser(tg_user);
        } else {
            app_user = await userOptions.createUserComplete(tg_user, friend_id);    
        }
        const session_token = userOptions.createSessionToken(app_user);
        res.cookie('session_token', session_token, { httpOnly: true });
        res.status(201).json({ app_user, session_token });
    } else {
        res.status(400).json({ error: 'Invalid user' });        
    }
});

export default router;