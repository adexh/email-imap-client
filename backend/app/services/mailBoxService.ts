import { ImapClient } from '../../infrastructure/imap';
import { User, Email, MailBoxDetails } from 'shared-types';
import type { ElasticService } from './elasticSearchService';
import { UserService } from './userService';
import logger from '../../utils/logger';
import { AccessTokenService } from './accessTokenService';
import { PollClients } from '../dataAccess/pollingClients';

export class MailBoxService {

    private idleRunning:boolean = false;

    constructor(
        private elastiService: ElasticService,
        private userService: UserService,
        private accessTokenService: AccessTokenService,
        private imap: ImapClient,
        private pollClients : PollClients
    ) { }

    async mailBoxSync(user: User): Promise<void> {

        if (!user.linkedMail) {
            throw new Error('No linked mail for user present');
        }

        const token = await this.userService.accessToken(user.email);

        await this.imap.connect(user.linkedMail, token);

        const imapClient = this.imap.getClient();

        const lock = await imapClient.getMailboxLock('INBOX');

        const mailboxStatus = await imapClient.status('INBOX', {
            messages: true,
            unseen: true
        });

        lock.release();

        const mailboxDetails: MailBoxDetails = {
            user_id: user.id,
            user_email: user.email,
            email_id: user.linkedMail,
            mailbox_id: 'inbox',
            mailbox_name: 'Inbox',
            total_messages: mailboxStatus.messages ? mailboxStatus.messages : 0,
            unread_messages: mailboxStatus.unseen ? mailboxStatus.unseen : 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        await this.elastiService.indexMailBox(mailboxDetails);
    }

    async emailSync(user: User, offset=0, retry = 0): Promise<void> {
        if (!user.linkedMail) {
            throw new Error('No linked mail for user present');
        }

        try {

            const token = await this.userService.accessToken(user.email);

            if( !this.imap.isSyncConnected ) {
                await this.imap.connectSync(user.linkedMail, token);
            }
            const imapClient = this.imap.getSyncClient();

            logger.debug('connected to client');

            const lock = await this.imap.getMailboxLockSync('INBOX');

            const status = await imapClient.status('INBOX', {messages: true, highestModseq: true});
            const range = (status.messages-offset-20)+':'+(status.messages-offset)
            logger.debug(range);

            const sinceDate = new Date();
            sinceDate.setDate(sinceDate.getDate() - 7);

            for await (let message of imapClient.fetch(
                { seq: range },
                { envelope: true, source: true, flags: true }
            )) {
                const email: Email = {
                    user_id: user.id,
                    user_email: user.email,
                    email_id: user.linkedMail,
                    email_uid: message.uid,
                    from: message.envelope.from.map((addr) => addr.address).join(', '),
                    to: message.envelope.to.map((addr) => addr.address).join(', '),
                    subject: message.envelope.subject,
                    body: message.source.toString('utf-8'),
                    received_at: message.envelope.date,
                    sendersName: message.envelope.from[0].name ? message.envelope.from[0].name : message.envelope.subject.slice(0, 10) + '...',
                    seen: message.flags.has('\\Seen'),
                    attachments: [] // Add attachment handling if needed
                };
                const docId = `${user.linkedMail}${message.uid}`
                await this.elastiService.indexMail(email, docId);
            }

            lock.release();

            logger.info("Email Sync done");
        } catch (error) {
            logger.error(error);

            await this.accessTokenService.refreshToken(user);
            if( retry < 1 ) {
                await this.emailSync(user,offset,retry + 1);
            } else {
                await this.accessTokenService.removeToken(user.email);
            }
        }
    }

    async startIdle (user: User, retry=0) {
        logger.debug('Initiating idle');
        try {
            const token = await this.userService.accessToken(user.email);

            await this.imap.connect(user.linkedMail, token);
            logger.debug('got connection');

            const client = this.imap.getClient();

            await client.mailboxOpen('INBOX');

            client.idle();

            this.idleRunning = true;

            const events = ['exists', 'flags', 'expunge'];
            events.forEach(event => {
                client.on(event, (data) => {
                    logger.debug(`Got new message: ${JSON.stringify(data)} `);
                    
                    let query = {};

                    if ( !data.vanished || data.vanished ) {
                        query["deleted"] = true;
                    } else if( data.seq ) {
                        query["seq"] = data.seq;
                    } else if ( data.count ) {
                        query["seq"] = data.prevCount+':'+data.count;
                    } else {
                        query["recent"] = true;
                    }

                    (async ()=>{ for await (let message of client.fetch(
                        query,
                        { envelope: true, source: true, flags: true }
                    )) {
                        
                        logger.debug(event);
                        if( event == 'expunge' ) {
                            const docId = `${user.linkedMail}${message.uid}`
                            logger.debug(docId);
                            await this.elastiService.deleteMail(user.linkedMail, docId);
                        } else {
                            const email: Email = {
                                user_id: user.id,
                                user_email: user.email,
                                email_id: user.linkedMail,
                                email_uid: message.uid,
                                from: message.envelope.from.map((addr) => addr.address).join(', '),
                                to: message.envelope.to.map((addr) => addr.address).join(', '),
                                subject: message.envelope.subject,
                                body: message.source.toString('utf-8'),
                                received_at: message.envelope.date,
                                sendersName: message.envelope.from[0].name ? message.envelope.from[0].name : message.envelope.subject.slice(0, 10) + '...',
                                seen: message.flags.has('\\Seen'),
                                attachments: [] // Add attachment handling if needed
                            };
                            const docId = `${user.linkedMail}${message.uid}`
                            await this.elastiService.indexMail(email, docId);
                        }

                        setTimeout(()=>{
                            this.pollClients.sendResponseToClients('UPDATE');
                        }, 1000);  //TTo accomodate delay in indexing data in ES
                    }})();
    
                });
            });
    


            logger.debug('event attached');
        } catch (err) {
            logger.error('IMAP connection error:', err);
            console.log(err);
            if( err.authenticationFailed ) {
                await this.accessTokenService.refreshToken(user);
            }

            if ( retry < 3 ) {
                await new Promise(res => setTimeout(res, 5000)); // 5 seconds delay
                this.startIdle(user, retry + 1);
            } else {
                logger.error('IMAP connection closed unexpectedly');
                this.idleRunning = false;
            }
        }
    }

    async isIdleStarted() {
        return this.idleRunning;
    }
}