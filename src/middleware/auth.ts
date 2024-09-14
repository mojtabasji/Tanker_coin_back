import express, { Request, Response, NextFunction } from 'express';
import Session from '../modules/session';

export const sessionCheck = (req: Request, res: Response, next: NextFunction) => {
    // Check if user is authenticated
    if (!req.cookies.session_token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!Session.validateSessionToken(req.cookies.session_token)) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Continue to the next middleware or route handler
    next();
};

// Create an Express router
// const router = express.Router();

// Apply the session middleware to the '/users' path
// router.use('/users', sessionMiddleware);

// Define your '/users' routes here
