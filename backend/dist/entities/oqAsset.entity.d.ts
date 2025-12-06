import { Document } from './document.entity';
export declare class oqAsset {
    id: string;
    document_id: string;
    document: Document;
    token_id: string;
    face_value_usd: number;
    mint_tx_hash: string;
    owner_address: string;
    created_at: Date;
}
