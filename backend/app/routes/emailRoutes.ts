import { Router } from 'express';
import { authenticate } from '../../middlewares/auth';
import { EmailclientController } from '../controllers/emailclientController';
import { GenerateAccountLinkUrl } from '../services/generateAccountLinkUrl';
import { SaveAccessToken } from '../services/saveMailAccessToken';
import { UserRepository } from '../dataAccess/userRepository';
import { ElasticService } from '../services/elasticSearchService';
import { RefreshAccessToken } from '../services/regreshAccessToken';
import { MailBoxService } from '../services/mailBoxService';
import { UserService } from '../services/userService';

const generateAccountLinkUrlService = new GenerateAccountLinkUrl();

const userRepository = new UserRepository();

const elasticService = new ElasticService();
const userService = new UserService(userRepository);
const mailBoxService = new MailBoxService(elasticService, userService);
const refreshTokenService = new RefreshAccessToken(userRepository);
const saveAccessTokenService = new SaveAccessToken(userRepository);

const emailclientController = new EmailclientController(
                                    generateAccountLinkUrlService,
                                    saveAccessTokenService,
                                    elasticService,
                                    refreshTokenService,
                                    mailBoxService
                                    );

const mail = Router();

mail.use(authenticate);

mail.get('/genlinkurl', emailclientController.getAccountLinkUrl );

mail.post('/savetoken', emailclientController.saveAccessToken)

mail.post('/getEmails', emailclientController.getInbox);

mail.get('/refreshToken', emailclientController.refreshToken);

export default mail;