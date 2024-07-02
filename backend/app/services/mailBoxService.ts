import { ImapClient } from '../../infrastructure/imap';
import { User, Email, MailBoxDetails } from 'shared-types';
import type { ElasticService } from './elasticSearchService';
import { UserService } from './userService';

export class MailBoxService {
    constructor(
        private elastiService: ElasticService,
        private userService: UserService
    ) { }

    async mailBoxSync(user: User): Promise<void> {

        if (!user.linkedMail) {
            throw new Error('No linked mail for user present');
        }

        const token = await this.userService.accessToken(user.email);

        const imap = new ImapClient(user.linkedMail, token);
        await imap.connect();

        const imapClient = imap.getClient();

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

    async emailSync(user: User): Promise<void> {
        if (!user.linkedMail) {
            throw new Error('No linked mail for user present');
        }

        const token = await this.userService.accessToken(user.email);

        const imap = new ImapClient(user.linkedMail, token);
        await imap.connect();

        const imapClient = imap.getClient();

        const lock = await imapClient.getMailboxLock('INBOX');

        const sinceDate = new Date();
        sinceDate.setDate(sinceDate.getDate() - 7);

        for await (let message of imapClient.fetch(
            { since: sinceDate },
            { envelope: true, source: true, flags: true }
        )) {
            const email : Email = {
                user_id: user.id,
                user_email: user.email,
                email_id: user.linkedMail,
                email_uid: message.uid,
                from: message.envelope.from.map((addr) => addr.address).join(', '),
                to: message.envelope.to.map((addr) => addr.address).join(', '),
                subject: message.envelope.subject,
                body: message.source.toString('utf-8'),
                received_at: message.envelope.date,
                sendersName: message.envelope.from[0].name?message.envelope.from[0].name:message.envelope.subject.slice(0,10)+'...',
                attachments: [] // Add attachment handling if needed
            };
            await this.elastiService.indexMail(email);  
        }

        lock.release();
    }
}