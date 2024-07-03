import { Router } from 'express';
import { authenticate } from '../../middlewares/auth';
import { EmailclientController } from '../controllers/emailclientController';
import { GenerateAccountLinkUrl } from '../services/generateAccountLinkUrl';
import { UserRepository } from '../dataAccess/userRepository';
import { ElasticService } from '../services/elasticSearchService';
import { MailBoxService } from '../services/mailBoxService';
import { UserService } from '../services/userService';
import { AccessTokenService } from '../services/accessTokenService';

const generateAccountLinkUrlService = new GenerateAccountLinkUrl();

const userRepository = new UserRepository();

const elasticService = new ElasticService();

const userService = new UserService(userRepository);
const accessTokenService = new AccessTokenService(userRepository);
const mailBoxService = new MailBoxService(elasticService, userService, accessTokenService);

const emailclientController = new EmailclientController(
                                    generateAccountLinkUrlService,
                                    elasticService,
                                    mailBoxService,
                                    accessTokenService
                                    );

const mail = Router();

mail.use(authenticate);

mail.get('/genlinkurl', emailclientController.getAccountLinkUrl );

mail.post('/savetoken', emailclientController.saveAccessToken)

mail.post('/getEmails', emailclientController.getInbox);

mail.get('/refreshToken', emailclientController.refreshToken);

export default mail;