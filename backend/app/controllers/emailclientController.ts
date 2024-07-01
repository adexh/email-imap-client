import { Request, Response } from "express";
import type { GenerateAccountLinkUrl } from "../services/generateAccountLinkUrl";
import type { SaveAccessToken } from "../services/saveMailAccessToken";

export class EmailclientController {
    constructor(
        private generateAccountLinkUrl: GenerateAccountLinkUrl,
        private saveAccessTokenService: SaveAccessToken
    ) { }

    getAccountLinkUrl = async (res: Response) => {
        try {
            const url = await this.generateAccountLinkUrl.execute();
            return res.status(200).json({ url });
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    saveAccessToken = async (req: Request, res: Response) => {
        if (!req.body.code) {
            return res.status(300).send('Code not found');
        }

        if (!req.session.user?.name) {
            return res.status(401).send('Unauthorized');
        }
        const name = req.session.user.name;

        try {
            await this.saveAccessTokenService.execute(req.body.code, name);
            return res.status(200).send('Updated');
        } catch (error: any) {
            return res.status(500).send(error.message);
        }
    }
}