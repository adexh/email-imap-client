import { Request, Response } from "express";
import { LoginService } from "../services/authService";
import { redisClient } from "../../infrastructure/redis";

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
                console.log(user);
                
                if( user.linkedMail ) {
                    return res.status(200).json({isLinked: true});
                }
                return res.status(200).send("sucess");
            } else {
                return res.status(401).send("Unauthorized");
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send("Internal Server error");
        }
    };

    logout = async (req: Request, res: Response) => {
        try {
            req.session.destroy( async (err) => {
                if (err) {
                    console.log("error in logout ",err);
                    return res.status(500).send('Failed to logout');
                }
                res.clearCookie('session-id');
                res.send('Logged out');
              });
        } catch (error) {
            console.log(error);
            throw new Error('Error in logout');
        }
    }
}