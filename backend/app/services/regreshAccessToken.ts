import axios from 'axios';
import qs from 'qs';
import { UserRepository } from '../dataAccess/userRepository';
import { User } from 'shared-types';

export class RefreshAccessToken {
  constructor(private userRepository: UserRepository) {}

  public async execute(user: User): Promise<void> {

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

    const { access_token, refresh_token } = resp.data.access_token;

    await this.userRepository.updateUserToken(user.email, user.linkedMail, access_token, refresh_token);
  }
}