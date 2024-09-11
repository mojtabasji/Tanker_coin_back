import { Request, Response, NextFunction } from 'express';

export default class Validator {
    static validateCreateUser(req: Request, res: Response, next: NextFunction) {
        if (!req.body.name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        next();
    }

    static validateUpdateUser(req: Request, res: Response, next: NextFunction) {
        if (!req.body.name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        next();
    }

    static validateIncomeUserData(req: Request, res: Response, next: NextFunction) {
        if (!req.body.name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        next();
    }
}
