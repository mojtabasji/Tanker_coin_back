import { Router, Request, Response } from 'express';
import validators from '../utils/validator';
import { sessionCheck } from '../middleware/auth';

const router = Router();


router.use('/users', sessionCheck);
/**
 * @swagger
 * /api/users:
 *   get:
 *     description: Get all users
 *     responses:
 *       200:
 *         description: A list of users
 */
router.get('/users', (req: Request, res: Response) => {
    res.json([{ id: 1, name: 'John Doe' }]);
});

// create new user
/**
 * @swagger
 * /api/users:
 *  post:
 *   description: Create a new user
 *  requestBody:
 *   required: true
 *  content:
 *  application/json:
 *  schema:
 *  type: object
 * properties:
 * name:
 * type: string
 * example: John Doe
 * responses:
 *   201:
 *     description: User created successfully
 *   400:
 *     description: Bad request
 *   500:
 *     description: Internal server error
 */
router.post('/users', (req, res) => {
    // Your logic to create a new user in the database
    const newUser = [{ id: 2, name: 'Jane Doe' }];
    res.status(201).json(newUser);
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     description: Get a user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A user object
 *       404:
 *         description: User not found
 */
router.get('/users/:id', (req: Request, res: Response) => {
    const userId = parseInt(req.params.id, 10);
    if (userId === 1) {
        res.json({ id: 1, name: 'John Doe' });
    } else {
        res.status(404).send('User not found');
    }
});

// PUT /api/users/:id - Update a user
/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     description: Update a user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       204:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    // Your logic to update the user with the given ID in the database
    res.sendStatus(204);
});

// DELETE /api/users/:id - Delete a user
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     description: Delete a user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user to delete
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    // Your logic to delete the user with the given ID in the database
    res.sendStatus(204);
});


// Get /api/users/:id/GameData - Get user game data
/**
 * @swagger
 * /api/users/{id}/GameData:
 *   get:
 *     description: Get game data of a user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user to retrieve game data
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Game data of the user
 *       404:
 *         description: User not found
 */
router.get('/users/:id/GameData', (req: Request, res: Response) => {
    const userId = parseInt(req.params.id, 10);
    if (userId === 1) {
        res.json({ id: 1, gameData: 'Game data of John Doe' });
    } else {
        res.status(404).send('User not found');
    }
});

export default router;