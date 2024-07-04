import logger from "../../utils/logger";

export class PollClients {
    constructor(private clients = []) { }

    pushClient = (res: any) => {
        this.clients.push(res);
    }

    sendResponseToClients = (command:string) => {
        this.clients.forEach(res => {
            try {
                res.status(200).send(command);
                this.clients.pop();

            } catch (error) {
                logger.error(error);
                logger.error('Error in sending response to polling clients');
            }
        })
    }

    removeClient = (res: any) => {
        this.clients.pop();
    }

    getCount = () => {
        return this.clients.length;
    }
}