import axios from 'axios';
import qs from 'qs';
import { UserRepository } from '../dataAccess/userRepository';
import { User } from 'shared-types';
import logger from '../../utils/logger';

export class AccessTokenService {
  constructor(private userRepository: UserRepository) {}

  public async refreshToken(user: User): Promise<void> {

    if(!user.linkedMail) {
        throw new Error('No linked mail for user');
    }

    const tokenData = await this.userRepository.getRefreshToken(user.email);

    const data = {
      "client_id": process.env.CLIENT_ID,
      "scope": "https://outlook.office.com/IMAP.AccessAsUser.All offline_access https://outlook.office.com/User.Read",
      "redirect_uri": encodeURI(process.env.REDIRECT_URI as string),
      "grant_type": "refresh_token",
      "client_secret": process.env.CLIENT_SECRET,
      "refresh_token": tokenData.refresh_token,
      "code": tokenData.code
    };

    const resp = await axios.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', qs.stringify(data), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token, refresh_token } = resp.data;
    logger.debug("Got refresh tokens");

    await this.userRepository.updateUserToken(user.email, user.linkedMail, access_token, refresh_token);
  }

  public async saveToken(code: string, email: string): Promise<string> {
    const data = {
      "client_id": process.env.CLIENT_ID,
      "scope": "https://outlook.office.com/IMAP.AccessAsUser.All offline_access https://outlook.office.com/User.Read",
      "redirect_uri": encodeURI(process.env.REDIRECT_URI as string),
      "grant_type": "authorization_code",
      "client_secret": process.env.CLIENT_SECRET,
      "code": code
    };

    const resp = await axios.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', qs.stringify(data), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const {access_token, refresh_token } = resp.data;

    const profileResp = await axios.get('https://outlook.office.com/api/v2.0/me', {
      headers: {
        'Authorization': 'Bearer '+ access_token
      },
    });

    const linkedMail = profileResp.data.EmailAddress;

    await this.userRepository.updateUserToken(email, linkedMail, access_token, refresh_token);

    return linkedMail;
  }

  public async removeToken(email: string): Promise<void> {
    await this.userRepository.removeToken(email);
  }
}