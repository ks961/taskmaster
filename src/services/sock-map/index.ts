import { Socket } from "socket.io";
import { TUser } from "../../models/user.model";


export class SockMap {
    private userIdToSocketMap;
    constructor() {
        this.userIdToSocketMap = new Map<TUser["userId"], Socket>();
    }

    set(userId: string, socket: Socket) {
        this.userIdToSocketMap.set(userId, socket);
    }

    get(userId: string) {
        return this.userIdToSocketMap.get(userId);
    }

    has(userId: string) {
        return this.userIdToSocketMap.has(userId);
    }

    delete(userId: string) {
        return this.userIdToSocketMap.delete(userId);
    }
}