import { Request, Response } from "express";
import type { GenerateAccountLinkUrl } from "../services/generateAccountLinkUrl";
import { ElasticService } from "../services/elasticSearchService";
import { MailBoxService } from "../services/mailBoxService";
import logger from '../../utils/logger';
import { AccessTokenService } from "../services/accessTokenService";
import { ImapClient } from "../../infrastructure/imap";
import { PollClients } from "../dataAccess/pollingClients";


export class EmailclientController {
    constructor(
        private generateAccountLinkUrl: GenerateAccountLinkUrl,
        private elasticService: ElasticService,
        private mailBoxService: MailBoxService,
        private accessTokenService: AccessTokenService,
        private imap: ImapClient,
        private pollClients: PollClients
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
            const linkedMail = await this.accessTokenService.saveToken(req.body.code, email);
            req.session.user.linkedMail = linkedMail;

            this.mailBoxService.startIdle(req.session.user); // Asynchronously start the mail sync service

            return res.status(200).send('Updated');
        } catch (error: any) {
            logger.error(error);
            return res.status(500).send(error.message);
        }
    } 

    refreshToken = async (req: Request, res: Response) => {
        try {
            if( !req.session.user ){
                return res.status(401).send('Unauthorized');
            }
            logger.info("Refresh token called");
            await this.accessTokenService.refreshToken(req.session.user);
            return res.status(200).send('Refresh');
        } catch (error) {
            return res.status(500).send('Internal Server Error');
        }
    }

    getInbox = async (req: Request, res: Response) => {
        try {
            if( !req.session.user?.linkedMail ) {
                return res.status(401).send('Unauthorised');
            }

            const started = await this.mailBoxService.isIdleStarted();
            if( !started ) {
                logger.debug('Started Idle')
                this.mailBoxService.startIdle(req.session.user); // Asynchronously start the mail sync service if not running
            }
            const {pageIndex, pageSize} = req.body;
            this.mailBoxService.emailSync(req.session.user, pageIndex*pageSize);

            const mails = await this.elasticService.getEmails(req.session.user, pageIndex*pageSize, pageSize);
            console.log("Mails count : ",mails.length);
                  
            return res.status(200).json(mails);
        } catch (error:any) {
            logger.error(error);
            return res.status(401).send("AUTHENTICATE FAILED");
        }
    }

    poll = async (req: Request, res: Response) => {
        res.setHeader('Cache-Control', 'no-store');
        this.pollClients.pushClient(res);

        const id = setTimeout(() => {
            this.pollClients.sendResponseToClients('RENEW');
        }, 2000);

        req.on('close', () => {
            console.log('Client disconnected');
            this.pollClients.removeClient(res); // Ensure you have a method to remove the client
            logger.debug(this.pollClients.getCount() + " : clients");
            clearTimeout(id);
            return
        });
    }
}