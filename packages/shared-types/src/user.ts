export type User = {
    id: number;
    name: string;
    email: string;
    linkedMail?:string;
    password?: string;
    profilePictureUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
    lastLoginAt?: Date;
};