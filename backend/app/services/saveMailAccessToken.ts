import axios from 'axios';
import qs from 'qs';
import { UserRepository } from '../dataAccess/userRepository';

export class SaveAccessToken {
  constructor(private userRepository: UserRepository) {}

  public async execute(code: string, userName: string): Promise<void> {
    const data = {
      "client_id": process.env.CLIENT_ID,
      "scope": "https://outlook.office.com/IMAP.AccessAsUser.All offline_access",
      "redirect_uri": "http://localhost:4200",
      "grant_type": "authorization_code",
      "client_secret": process.env.CLIENT_SECRET,
      "code": code
    };

    const resp = await axios.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', qs.stringify(data), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const token = resp.data.access_token;
    await this.userRepository.updateUserToken(userName, token);
  }
}