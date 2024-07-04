import esClient from '../../infrastructure/elasticSearch';
import { User, MailBoxDetails, Email } from 'shared-types';
import logger from '../../utils/logger';

export class ElasticService {
    
    async indexMailBox (mailBoxDetails : MailBoxDetails):Promise<void> {
        try {
            await esClient.index({
                index: 'user_mailboxes',
                body: mailBoxDetails
            });

        } catch (error) {
            throw new Error("Error indexing mailbox");
        }
    }

    async indexMail (mail : Email, docId: string) {
        try {
            await esClient.index({
                index: 'user_emails',
                id: docId,
                document: mail,
            })
        } catch (error) {
            throw new Error(`Error indexing email for : ${mail.email_uid}`);
        }
    }

    async deleteMail (user_email: string, docId: string) {
        try {
            const result = await esClient.deleteByQuery({
                index: 'user_emails',
                body: {
                    query: {
                        match: {
                            id: docId
                        }
                    }
                }
            });
            console.log('Record deleted:', result);
        } catch (error) {
            logger.error('Unable to delete the email');
            logger.error(error);
        }
    }

    async getEmails(user: User, offset: number, limit: number): Promise<any> {
        try {
            const body = await esClient.search({
                index: 'user_emails',
                body: {
                    query: {
                        match: {
                            user_email: user.email
                        }
                    },
                    sort: [
                        { received_at: { order: 'desc' } }
                    ],
                    from: offset,
                    size: limit
                }
            });

            if( body.hits.hits?.length > 0 ) {
                const emails = body.hits.hits.map((hit: any) => ({
                    id: hit._source.email_uid,  // Map email_uid to id
                    received_at: hit._source.received_at,
                    sendersName: hit._source.sendersName,
                    from: hit._source.from,
                    subject: hit._source.subject,
                    seen: hit._source.seen
                  }));

                return emails;
            } else {
                return [];
            }
        } catch (error) {
            logger.error(error);
            throw new Error('Error while fetching email from ES');
        }
    }

}