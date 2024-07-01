import { Request, Response, NextFunction } from "express";

export function authenticate(req: Request, res: Response, next: NextFunction) {
    if (!req.session || !req.session.user) {
        const err = new Error('You shall not pass');
        return res.status(401).json({message:"Unauthorized"})
    }
    next();
}