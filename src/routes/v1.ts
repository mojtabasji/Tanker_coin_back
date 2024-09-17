import { Router, Request, Response } from 'express';
import validators from '../utils/validator';
import { sessionCheck } from '../middleware/auth';
import UserOptions from '../utils/user';
import Game from '../modules/game';
import Tanker from '../modules/tanker';
import User from '../modules/user';
import { App_User, GameData } from '../utils/Types';

const router = Router();

router.use('*', sessionCheck);

/**
 * @swagger
 * /api/v1/loadGame:
 *  get:
 *   description: Load a game
 *   responses:
 *    '200':
 *     description: Game loaded successfully
 *     content:
 *      application/json:
 *       schema: 
 *        type: object
 *        properties:
 *         gameData:
 *          type: object
 *          properties:
 *           id:
 *            type: number
 *            example: 1
 *           mineable:
 *            type: boolean
 *            example: 1
 *           coins:
 *            type: number
 *            example: 0
 *           power:
 *            type: number
 *            example: 0
 *           activeTanker:
 *            type: object
 *            properties:
 *             id:
 *              type: number
 *              example: 1
 *             power:
 *              type: number
 *              example: 50
 *             capacity:
 *              type: number
 *              example: 50
 *             speed:
 *              type: number
 *              example: 0.2
 *             price:
 *              type: number
 *              example: 0
 *             image:
 *              type: string
 *              example: '�/�i�m�a�g�e�s�/�1�.�p�ng'
 *             name:
 *              type: string
 *              example: null
 *           unlockedTankers:
 *            type: string
 *            example: '[1]'
 *           lastUpdate:
 *            type: number
 *            example: 2147483647
 *    '400':
 *      description: Bad request
 *    '500':
 *      description: Internal server error
 */
router.get('/loadGame', async (req: Request, res: Response) => {
    const token = req.cookies['session_token'];
    let user: App_User | null = await UserOptions.getAuthenticatedUser(token);
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const gameData = user.gameData? await Game.getGameDataById(user.gameData): null;
    if (gameData && typeof gameData.activeTanker === 'number') {
        const tanker = await Tanker.getTankerById(gameData.activeTanker);
        gameData.activeTanker = tanker;
    }
    res.json({ gameData });
});


/**
 * @swagger
 * /api/v1/saveGame:
 *  post:
 *   description: Save a game
 *  responses:
 *   200:
 *    description: Game saved successfully
 *   400:
 *    description: Bad request
 *   500:
 *    description: Internal server error
 */
router.post('/saveGame', (req: Request, res: Response) => {
    res.json({ message: 'Game saved successfully' });
});


/**
 * @swagger
 * /api/v1/updateGame:
 *  post:
 *   description: Update a game
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        gameData:
 *         $ref: '#/src/utils/Types/GameData'
 *   responses:
 *    200:
 *     description: Game updated successfully
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: 'Game updated successfully'
 *         status:
 *          type: number
 *          example: 200
 *         state:
 *          type: string
 *          example: 'success'
 *    400:
 *     description: Bad request
 *    500:
 *     description: Internal server error
 */
router.post('/updateGame', async (req: Request, res: Response) => {
    const gameData: GameData = req.body.gameData;
    await Game.updateGameData(gameData);
    res.json({ message: 'Game updated successfully', status: 200, state: 'success' });
});


/**
 * @swagger
 * /api/v1/getFriends:
 *  get:
 *   description: Get friends
 *   responses:
 *    200:
 *     description: A list of friends
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         $ref: '#/src/utils/Types/App_User'
 *    400:
 *     description: Bad request
 *    500:
 *     description: Internal server error
 */
router.get('/getFriends', async (req: Request, res: Response) => {
    const token = req.cookies['session_token'];
    let user: App_User | null = await UserOptions.getAuthenticatedUser(token);
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    let friends: App_User[] = [];
    let user_friends: number[] = User.convertFriendsToArray(user.friends as any);
    console.log("friends: ", user_friends, typeof user_friends);
    for (let friendId of  user_friends) {
        let friend: App_User | null = await User.getUserById(friendId);
        if (friend) {
            friends.push(friend);
        }
    }
    res.json(friends);
});


/**
 * @swagger
 * /api/v1/getUsersList:
 *  get:
 *   description: Get users list
 *  responses:
 *   200:
 *    description: A list of users
 *   400:
 *    description: Bad request
 *   500:
 *    description: Internal server error
 */
router.get('/getUsersList', (req: Request, res: Response) => {
    res.json([{ id: 1, name: 'John Doe' }]);
});


/**
 * @swagger
 * /api/v1/getNetworkState:
 *  get:
 *   description: Get network state
 *  responses:
 *   200:
 *    description: Network state
 *   400:
 *    description: Bad request
 *   500:
 *    description: Internal server error
 */
router.get('/getNetworkState', (req: Request, res: Response) => {
    res.json({ networkState: 'Connected' });
});


export default router;

