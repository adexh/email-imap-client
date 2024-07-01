import { Request, Response } from "express";
import { UserService } from "../services/userService";

export class UserController {
    constructor(private userService: UserService) {}

    register = async (req: Request, res: Response) => {
        try {
            const message = await this.userService.register(req.body);
            return res.status(201).send(message);
        } catch (error: any) {
            const statusCode = error.message === 'Email already in use' ? 409 : 500;
            return res.status(statusCode).send(error.message);
        }
    };

    userInfo = async (req: Request, res: Response) => {
        try {
            const userInfo = this.userService.getUserInfo(req.session.user);
            return res.status(200).json(userInfo);
        } catch (error: any) {
            return res.status(401).send(error.message);
        }
    };
}