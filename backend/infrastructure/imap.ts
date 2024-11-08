import { ImapFlow, MailboxLockObject } from 'imapflow';
import logger from '../utils/logger';

export class ImapClient {
    private client:ImapFlow | null = null;
    private syncClient:ImapFlow | null = null;
    private isConnected:boolean = false;
    isSyncConnected:boolean = false;
    private mailBoxLock:MailboxLockObject | null = null;

    constructor() {
        logger.debug('Imap constructor called')
    }

    getClient() {
        return this.client;
    }

    getSyncClient() {
        return this.syncClient;
    }

    async connect(email: string, token: string) {

        if (this.client) {
            // Ensure the previous client is properly closed before creating a new one
            await this.client.logout();
            this.client = null;
            this.isConnected = false;
            logger.debug('Previous client connection closed');
        }

        this.client = new ImapFlow({
            auth: {
                user: email,
                accessToken: token
            },
            logger: false,
            host: 'outlook.office365.com',
            port: 993,
            maxIdleTime: 30000,
            missingIdleCommand: 'NOOP',
            tls: {
                rejectUnauthorized: false
            },
            greetingTimeout: 600000,
            socketTimeout: 600000
        });
        logger.debug('Client set');

        await this.client.connect();
        this.isConnected = true;
        logger.debug('connected imap client')
    }

    async connectSync(email: string, token: string) {
        this.syncClient = new ImapFlow({
            auth: {
                user: email,
                accessToken: token
            },
            logger: false,
            host: 'outlook.office365.com',
            port: 993,
            maxIdleTime: 30000,
            missingIdleCommand: 'NOOP',
            tls: {
                rejectUnauthorized: false
            },
            greetingTimeout: 600000,
            socketTimeout: 600000
        });
        logger.debug('Client set');

        await this.syncClient.connect();
        this.isSyncConnected = true;
        logger.debug('connected imap client')
    }

    async disconnect() {
        this.isConnected = false;
        if( !this.client ) return; 
        await this.client.logout();
    }

    async getMailboxLock(mailbox: string) {
        if( !this.client )
            throw new Error('Client not connected');
        this.mailBoxLock = await this.client.getMailboxLock(mailbox);
        return this.mailBoxLock;
    }

    async getMailboxLockSync(mailbox: string) {
        if( !this.syncClient )
            throw new Error('Client not connected');

        this.mailBoxLock = await this.syncClient.getMailboxLock(mailbox);
        return this.mailBoxLock;
    }

    async lockReleast() {
        if( !this.mailBoxLock )
            throw new Error('Mailbox lock not set');
        if( !this.client )
            throw new Error('Client not connected');

        this.mailBoxLock.release();
    }
}