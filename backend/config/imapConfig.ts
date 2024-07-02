import dotenv from 'dotenv';

dotenv.config();

export const imapConfig = {
    imap: {
        host: process.env.IMAP_HOST,
        port: parseInt(process.env.IMAP_PORT || '993', 10),
        user: process.env.IMAP_USER,
        password: process.env.IMAP_PASSWORD,
        secure: true, // Set to false for non-secure connections
    }
};