export type MailBoxDetails = {
    user_id: number,
    user_email: string,
    email_id: string,
    mailbox_id: string,
    mailbox_name: string,
    total_messages: number,
    unread_messages: number,
    created_at: string,
    updated_at: string
}

export type Email = {
    user_id: number,
    user_email: string,
    email_id: string;
    email_uid: number,
    sendersName: string,
    from: string;
    to: string;
    subject: string;
    body: string;
    received_at: Date;
    seen:boolean,
    attachments?: Array<{
        file_name: string;
        file_size: number;
        mime_type: string;
    }>;
}