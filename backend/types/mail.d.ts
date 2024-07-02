type Email = {
    user_id: number,
    user_email: string,
    email_id: string;
    email_uid: number,
    from: string;
    to: string;
    subject: string;
    body: string;
    received_at: Date;
    attachments?: Array<{
        file_name: string;
        file_size: number;
        mime_type: string;
    }>;
}