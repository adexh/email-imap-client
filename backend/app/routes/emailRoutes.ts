import { Router } from 'express';
import { authenticate } from '../../middlewares/auth';
import { EmailclientController } from '../controllers/emailclientController';
import { GenerateAccountLinkUrl } from '../services/generateAccountLinkUrl';
import { UserRepository } from '../dataAccess/userRepository';
import { ElasticService } from '../services/elasticSearchService';
import { MailBoxService } from '../services/mailBoxService';
import { UserService } from '../services/userService';
import { AccessTokenService } from '../services/accessTokenService';
import { ImapClient } from '../../infrastructure/imap';
import { PollClients } from '../dataAccess/pollingClients';
 
const generateAccountLinkUrlService = new GenerateAccountLinkUrl();
const imap = new ImapClient();

const userRepository = new UserRepository();

const elasticService = new ElasticService();

const userService = new UserService(userRepository);
const accessTokenService = new AccessTokenService(userRepository);
const pollClients = new PollClients();

const mailBoxService = new MailBoxService(
                                    elasticService, 
                                    userService, 
                                    accessTokenService, 
                                    imap,
                                    pollClients
                                    );

const emailclientController = new EmailclientController(
                                    generateAccountLinkUrlService,
                                    elasticService,
                                    mailBoxService,
                                    accessTokenService,
                                    imap,
                                    pollClients
                                    );

const mail = Router();

mail.use(authenticate);

mail.get('/genlinkurl', emailclientController.getAccountLinkUrl );

mail.post('/savetoken', emailclientController.saveAccessToken)

mail.post('/getEmails', emailclientController.getInbox);

mail.get('/poll', emailclientController.poll);

mail.get('/refreshToken', emailclientController.refreshToken);

export default mail;