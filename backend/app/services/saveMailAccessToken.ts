import axios from 'axios';
import qs from 'qs';
import { UserRepository } from '../dataAccess/userRepository';

export class SaveAccessToken {
  constructor(private userRepository: UserRepository) {}

  public async execute(code: string, email: string): Promise<string> {
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

    const token = resp.data.access_token;

    const profileResp = await axios.get('https://outlook.office.com/api/v2.0/me', {
      headers: {
        'Authorization': 'Bearer '+ token
      },
      
    });

    const linkedMail = profileResp.data.EmailAddress;

    await this.userRepository.updateUserToken(email, linkedMail, token);

    return linkedMail;
  }
}