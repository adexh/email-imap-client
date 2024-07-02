import esClient from '../../infrastructure/elasticSearch';
import { User, MailBoxDetails, Email } from 'packages/shared-types';

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

    async indexMail (mail : Email) {
        try {
            await esClient.index({
                index: 'user_emails',
                body: mail
            })
        } catch (error) {
            throw new Error(`Error indexing email for : ${mail.email_uid}`);
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
                return body.hits.hits.map(hit => hit._source);
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
            throw new Error('Error while fetching email from ES');
        }
    }
}