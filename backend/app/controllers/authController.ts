import { Request, Response } from "express";
import { LoginService } from "../services/authService";
import logger from '../../utils/logger';

export class AuthController {
    constructor(private loginService : LoginService) { }

    login = async (req: Request, res: Response) => {
        try {
            const user = await this.loginService.login(req.body);
            if( user ) {
                req.session.user = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    linkedMail: user.linkedMail
                }
                logger.debug(user);
                
                if( user.linkedMail && user.token ) {
                    return res.status(200).json({isLinked: true});
                }
                return res.status(200).send("sucess");
            } else {
                return res.status(401).send("Unauthorized");
            }
        } catch (error) {
            logger.error(error);
            return res.status(500).send("Internal Server error");
        }
    };

    logout = async (req: Request, res: Response) => {
        try {
            req.session.destroy( async (err) => {
                if (err) {
                    logger.error("error in logout ",err);
                    return res.status(500).send('Failed to logout');
                }
                res.clearCookie('session-id');
                res.send('Logged out');
              });
        } catch (error) {
            logger.error(error);
            throw new Error('Error in logout');
        }
    }
}