import { Router } from 'express';
import { authenticate } from '../../middlewares/auth';
import { EmailclientController } from '../controllers/emailclientController';
import { GenerateAccountLinkUrl } from '../services/generateAccountLinkUrl';
import { SaveAccessToken } from '../services/saveMailAccessToken';
import { UserRepository } from '../dataAccess/userRepository';
import { ElasticService } from '../services/elasticSearchService';
import { RefreshAccessToken } from '../services/regreshAccessToken';

const generateAccountLinkUrlService = new GenerateAccountLinkUrl();

const userRepository = new UserRepository();

const elasticService = new ElasticService();
const refreshTokenService = new RefreshAccessToken(userRepository);
const saveAccessTokenService = new SaveAccessToken(userRepository);

const emailclientController = new EmailclientController(
                                    generateAccountLinkUrlService,
                                    saveAccessTokenService,
                                    elasticService,
                                    refreshTokenService
                                    );

const mail = Router();

mail.use(authenticate);

mail.get('/genlinkurl', emailclientController.getAccountLinkUrl );

mail.post('/savetoken', emailclientController.saveAccessToken)

mail.get('/getEmails', emailclientController.getInbox);

mail.get('/refreshToken', emailclientController.refreshToken);

export default mail;