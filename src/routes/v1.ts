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
 *  @swagger
 *  components:
 *      schemas:
 *          App_User:
 *              type: object
 *              properties:
 *                  id:
 *                      type: number
 *                      example: 1
 *                  tg_id:
 *                      type: number
 *                      example: 123456789
 *                  first_name:
 *                      type: string
 *                      example: 'John'
 *                  username:
 *                      type: string
 *                      example: 'johndoe'
 *                  friends:
 *                      type: string
 *                      example: '[1, 2, 3]'
 *                  gameData:
 *                      $ref: '#/components/schemas/GameData'
 *          WebAppUser:
 *              type: object
 *              properties:
 *                  id:
 *                      type: number
 *                      example: 1
 *                  tg_id:
 *                      type: number
 *                      example: 123456789
 *                  first_name:
 *                      type: string
 *                      example: 'John'
 *                  username:
 *                      type: string
 *                      example: 'johndoe'
 *                  friends:
 *                      type: string
 *                      example: '[1, 2, 3]'
 *                  gameData:
 *                      type: number
 *                      example: 1
 *          Tanker:
 *              type: object
 *              properties:
 *                  id:
 *                      type: number
 *                      example: 1
 *                  power:
 *                      type: number
 *                      example: 50
 *                  capacity:
 *                      type: number
 *                      example: 50
 *                  speed:
 *                      type: number
 *                      example: 0.2
 *                  price:
 *                      type: number
 *                      example: 0
 *                  image:
 *                      type: string
 *                      example: '�/�i�m�a�g�e�s�/�1�.�p�ng'
 *                  name:
 *                      type: string
 *                      example: null
 *          Session:
 *              type: object
 *              properties:
 *                  id:
 *                      type: number
 *                      example: 1
 *                  user_id:
 *                      type: number
 *                      example: 1
 *                  session_token:
 *                      type: string
 *                      example: '123456789'
 *                  created_at:
 *                      type: string
 *                      example: '2021-01-01 00:00:00'
 *                  updated_at:
 *                      type: string
 *                      example: '2021-01-01 00:00:00'
 *          Game:
 *              type: object
 *              properties:
 *                  id:
 *                      type: number
 *                      example: 1
 *                  mineable:
 *                      type: boolean
 *                      example: 1
 *                  coins:
 *                      type: number
 *                      example: 0
 *                  power:
 *                      type: number
 *                      example: 0
 *                  activeTanker:
 *                      $ref: '#/components/schemas/Tanker'
 *                  unlockedTankers:
 *                      type: string
 *                      example: '[1]'
 *                  lastUpdate:
 *                      type: number
 *                      example: 2147483647
 *          NetworkState:
 *              type: object
 *              properties:
 *                  UserCount:
 *                      type: number
 *                      example: 1
 *                  extractedCoins:
 *                      type: number
 *                      example: 0
 */


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
 *          $ref: '#/components/schemas/Game'
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
    const gameData = user.gameData ? await Game.getGameDataById(user.gameData) : null;
    if (gameData && typeof gameData.activeTanker === 'number') {
        const tanker = await Tanker.getTankerById(gameData.activeTanker);
        gameData.activeTanker = tanker;
    }
    res.json({ gameData });
});


/**
 * @swagger
 * /api/v1/saveGame:
 *  
 *  post:
 *      description: Save a game
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          gameData:
 *                              $ref: '#/components/schemas/Game'
 *      responses:
 *          200:
 *              description: Game saved successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: 'Game saved successfully'
 *                              status:
 *                                  type: number
 *                                  example: 200
 *                              state:
 *                                  type: string
 *                                  example: 'success'
 *          400:
 *              description: Bad request
 *          500:
 *              description: Internal server error
 */
router.post('/saveGame', async (req: Request, res: Response) => {
    const token = req.cookies['session_token'];
    let user: App_User | null = await UserOptions.getAuthenticatedUser(token);
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const gameData: GameData = req.body.gameData;
    await Game.saveGameData(gameData, user.id);
});


/**
 * @swagger
 * /api/v1/updateGame:
 *  post:
 *      description: Update a game
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          gameData:
 *                              $ref: '#/components/schemas/Game'
 *      responses:
 *          200:
 *              description: Game updated successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                                  example: 'Game updated successfully'
 *                              status:
 *                                  type: number
 *                                  example: 200
 *                              state:
 *                                  type: string
 *                                  example: 'success'
 *          400:
 *              description: Bad request
 *          500:
 *              description: Internal server error
 */
router.post('/updateGame', async (req: Request, res: Response) => {
    const token = req.cookies['session_token'];
    let user: App_User | null = await UserOptions.getAuthenticatedUser(token);
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const gameData: GameData = req.body.gameData;
    Game.updateGameData(gameData, user.id).then((gameData) => {
        if (typeof gameData === 'string') {
            res.status(400).json({ error: gameData });
        }
        else
            res.json({ message: 'Game updated successfully', status: 200, state: 'success' });
    }).catch((err) => {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    });
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
 *         $ref: '#/components/schemas/App_User'
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
    for (let friendId of user_friends) {
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
 *      description: Get users list
 *      parameters:
 *          - name: page
 *            in: query
 *            description: Page number
 *            required: false
 *            schema:
 *              type: integer
 *              example: 1
 *          - name: limit
 *            in: query
 *            description: Number of items per page
 *            required: false
 *            schema:
 *              type: integer
 *              example: 10
 *      responses:
 *          200:
 *              description: A list of users
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/User'
 *          400:
 *              description: Bad request
 *          500:
 *              description: Internal server error
 */
router.get('/getUsersList', (req: Request, res: Response) => {
    let page = req.query.page ? parseInt(req.query.page as string) : 1;
    let limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    User.getPagedUsersOrderByGameScore(page, limit).then((users) => {
        res.json(users);
    });
});


/**
 * @swagger
 * /api/v1/getNetworkState:
 *      get:
 *          description: Get network state
 *          responses:
 *              200:
 *                  description: Network state
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/NetworkState'
 *              500:
 *                  description: Internal server error
 */
router.get('/getNetworkState', (req: Request, res: Response) => {
    console.log("getNetworkState");
    User.networkState().then((state) => {
        console.log("network state:", state);
        res.json(state);
    }).catch((err) => {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    });
});


export default router;

