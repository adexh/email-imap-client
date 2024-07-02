import { Request, Response } from "express";
import type { GenerateAccountLinkUrl } from "../services/generateAccountLinkUrl";
import type { SaveAccessToken } from "../services/saveMailAccessToken";
import { ElasticService } from "../services/elasticSearchService";
import { RefreshAccessToken } from "../services/regreshAccessToken";

export class EmailclientController {
    constructor(
        private generateAccountLinkUrl: GenerateAccountLinkUrl,
        private saveAccessTokenService: SaveAccessToken,
        private elasticService: ElasticService,
        private refreshTokenService: RefreshAccessToken
    ) { }

    getAccountLinkUrl = async (req: Request, res: Response) => {
        try {
            const url = await this.generateAccountLinkUrl.execute();
            return res.status(200).send(url);
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
        const email = req.session.user.email;

        try {
            const linkedMail = await this.saveAccessTokenService.execute(req.body.code, email);
            req.session.user.linkedMail = linkedMail;

            return res.status(200).send('Updated');
        } catch (error: any) {
            console.log(error);
            return res.status(500).send(error.message);
        }
    }

    refreshToken = async (req: Request, res: Response) => {
        try {
            if( !req.session.user ){
                return res.status(401).send('Unauthorized');
            }
            await this.refreshTokenService.execute(req.session.user);
        } catch (error) {
            return res.status(500).send('Internal Server Error');
        }
    }

    getInbox = async (req: Request, res: Response) => {
        try {
            if( !req.session.user?.linkedMail ) {
                return res.status(401).send('Unauthorised');
            }

            const mails = await this.elasticService.getEmails(req.session.user, 0, 10);
            console.log("Mails count : ",mails.length);
                  
            return res.status(200).json(mails);
        } catch (error) {
            console.log(error);
            return res.status(500).send("Internal Server Error");
        }
    }
}