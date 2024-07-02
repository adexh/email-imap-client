import { ImapFlow } from 'imapflow';

export class ImapClient {
    private client: ImapFlow;

    constructor(email: string, token: string) {
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