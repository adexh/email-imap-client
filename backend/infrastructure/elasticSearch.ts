import { Client } from '@elastic/elasticsearch';
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
    node: process.env.ELASTIC_NODE,
    auth: {
      username: process.env.ELASTIC_USER as string,
      password: process.env.ELASTIC_PASS as string
    },
    tls: {
      rejectUnauthorized: false
    }
})

export default client;