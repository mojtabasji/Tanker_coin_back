import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';
import dotenv from 'dotenv';

import { ValidateDataResponse, WebAppInitData } from './Types';

const env = dotenv.config();
if (env.error) {
    throw new Error('Failed to read env file');
}

const TelegramBotToken: string = process.env.TELEGRAM_BOT_TOKEN || '';
const SecretKey = crypto.createHmac('sha256', 'WebAppData').update(TelegramBotToken).digest()

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

    static ValidateData (initData: any, secondsToExpire: number): ValidateDataResponse {
        const params = new URLSearchParams(initData as string)
        const data: WebAppInitData = { user: { id: 0, first_name: '' } }
        let hash = ''
        for (const [key, value] of params.entries()) {
          key === 'hash' ? hash = value : data[key] = value
        };
        const dataCheckString = Object.keys(data)
          .sort()
          .map(key => `${key}=${data[key]}`)
          .join('\n')
        const hmac = crypto.createHmac('sha256', SecretKey).update(dataCheckString).digest('hex');
        const currentTime = Date.now() / 1000;
        const currentAndAuthTimeDiff = currentTime - data.auth_date!;
        data.user = JSON.parse(data.user as any);
        if (secondsToExpire === 0) {
          return {
            isValid: hmac === hash,
            data
          }
        } else {
          return {
            isValid: !!(currentAndAuthTimeDiff < secondsToExpire && hmac === hash),
            data
          }
        }
    }
}
