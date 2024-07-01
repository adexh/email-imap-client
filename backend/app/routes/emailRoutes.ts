import { Router } from 'express';
import { authenticate } from '../../middlewares/auth';
import { EmailclientController } from '../controllers/emailclientController';
import { GenerateAccountLinkUrl } from '../services/generateAccountLinkUrl';
import { SaveAccessToken } from '../services/saveMailAccessToken';
import { UserRepository } from '../dataAccess/userRepository';

const generateAccountLinkUrlService = new GenerateAccountLinkUrl();

const userRepository = new UserRepository();
const saveAccessTokenService = new SaveAccessToken(userRepository);

const emailclientController = new EmailclientController(
                                    generateAccountLinkUrlService,
                                    saveAccessTokenService
                                    );

const mail = Router();

mail.use(authenticate);

mail.get('/genlinkurl', emailclientController.getAccountLinkUrl );

mail.post('/savetoken', emailclientController.saveAccessToken)



export default mail;