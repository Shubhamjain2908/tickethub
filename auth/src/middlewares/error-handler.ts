import { Request, Response, NextFunction } from 'express';
import { DatabaseConnectionError } from '../errors/database-connection-error';
import { RequestValidationError } from '../errors/request-validation-error';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof RequestValidationError) {
        console.log('Request validation error');
    } else if (err instanceof DatabaseConnectionError) {
        console.log('Database connection error');
    }

    res.status(400).send({
        message: err.message
    });
};