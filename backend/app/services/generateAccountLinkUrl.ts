export class GenerateAccountLinkUrl {
    public async execute(): Promise<string> {

        const client_id = process.env.CLIENT_ID;
        const redirect_uri = encodeURI(process.env.REDIRECT_URI as string);

        const url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
                    `client_id=${client_id}` + 
                    `&response_type=code` + 
                    `&redirect_uri=${redirect_uri}` + 
                    `&response_mode=query` + 
                    `&scope=https%3A%2F%2Foutlook.office.com%2FIMAP.AccessAsUser.All%20offline_access` + 
                    `&state=12345`; // State is for extra security
        return url;
    }
}