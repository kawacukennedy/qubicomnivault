import { User } from './user.entity';
export declare class Document {
    id: string;
    user_id: string;
    user: User;
    object_store_key: string;
    hash: string;
    status: string;
    created_at: Date;
}
