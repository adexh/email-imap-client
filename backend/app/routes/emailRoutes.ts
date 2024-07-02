import { Router } from 'express';
import { authenticate } from '../../middlewares/auth';
import { EmailclientController } from '../controllers/emailclientController';
import { GenerateAccountLinkUrl } from '../services/generateAccountLinkUrl';
import { SaveAccessToken } from '../services/saveMailAccessToken';
import { UserRepository } from '../dataAccess/userRepository';
import { UserService } from '../services/userService';
import { MailBoxService } from '../services/mailBoxService';
import { ElasticService } from '../services/elasticSearchService';

const generateAccountLinkUrlService = new GenerateAccountLinkUrl();

const userRepository = new UserRepository();

const elasticService = new ElasticService();
const userService = new UserService(userRepository);
const mailBoxService = new MailBoxService(elasticService, userService);
const saveAccessTokenService = new SaveAccessToken(userRepository);

const emailclientController = new EmailclientController(
                                    generateAccountLinkUrlService,
                                    saveAccessTokenService,
                                    userService,
                                    elasticService,
                                    mailBoxService
                                    );

const mail = Router();

mail.use(authenticate);

mail.get('/genlinkurl', emailclientController.getAccountLinkUrl );

mail.post('/savetoken', emailclientController.saveAccessToken)

mail.get('/getEmails', emailclientController.getInbox);

export default mail;