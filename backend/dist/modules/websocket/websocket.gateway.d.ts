import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private logger;
    handleConnection(client: Socket, ...args: any[]): void;
    handleDisconnect(client: Socket): void;
    handleJoinUserRoom(data: {
        userId: string;
    }, client: Socket): {
        event: string;
        data: {
            room: string;
        };
    };
    handleJoinValuationRoom(data: {
        jobId: string;
    }, client: Socket): {
        event: string;
        data: {
            room: string;
        };
    };
    emitToUser(userId: string, event: string, data: any): void;
    emitValuationUpdate(jobId: string, data: any): void;
    emitLoanUpdate(userId: string, data: any): void;
    emitPortfolioUpdate(userId: string, data: any): void;
    emitNotification(userId: string, notification: any): void;
}
