import { Request, Response } from "express";
import { LoginService } from "../services/authService";

export class AuthController {
    constructor(private loginService : LoginService) { }

    login = async (req: Request, res: Response) => {
        try {
            const user = await this.loginService.login(req.body);
            if( user ) {
                req.session.user = {
                    name: user.name,
                    email: user.email,
                }

                return res.status(200).send("sucess");
            } else {
                return res.status(401).send("Unauthorized");
            }
        } catch (error) {
            return res.status(500).send("Internal Server error");
        }
    };
}