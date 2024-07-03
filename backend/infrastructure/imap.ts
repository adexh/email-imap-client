import { ImapFlow } from 'imapflow';
import logger from '../utils/logger';

export class ImapClient {
    private client: ImapFlow;

    constructor(email: string, token: string) {
        logger.debug('Imap constructor called')
        this.client = new ImapFlow({
            auth: {
                user: email,
                accessToken: token
            },
            logger: false,
            host: 'outlook.office365.com',
            port: 993,
            tls: {
                rejectUnauthorized: false
            }
        });
    }

    getClient() {
        return this.client;
    }

    async connect() {
        await this.client.connect();
    }

    async disconnect() {
        await this.client.logout();
    }

    async getMailboxLock(mailbox: string) {
        return await this.client.getMailboxLock(mailbox);
    }
}